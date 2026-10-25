require "yaml"
require "date"
require "uri"

ROOT = File.expand_path("..", __dir__)
def read_yaml(path)
  YAML.safe_load(File.read(path, encoding: "UTF-8"), permitted_classes: [Date, Time], aliases: false)
end
def assert(condition, message)
  abort "FAIL: #{message}" unless condition
end
def front_matter(path)
  text = File.read(path, encoding: "UTF-8")
  match = text.match(/\A---\r?\n(.*?)\r?\n---(?:\r?\n|\z)/m)
  assert(match, "#{path}: missing YAML front matter")
  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false)
end

Dir.chdir(ROOT) do
  config = read_yaml("_config.yml")
  profile = read_yaml("_data/profile.yml")
  experience = read_yaml("_data/experience.yml")
  assert(config["future"] == false && config["show_drafts"] == false, "production must exclude drafts/future posts")
  assert(experience.map { |e| e["company"] } == %w[Tencent CAS Shopee OPPO], "preserve the agreed experience order")
  assert(File.file?(profile.fetch("avatar").sub(%r{^/}, "")), "avatar file missing")
  paths = Dir["_posts/*.md", "_drafts/*.md", "_projects/*.md"]
  documents = paths.map do |path|
    data = front_matter(path)
    %w[title description].each { |field| assert(data[field].is_a?(String) && !data[field].empty?, "#{path}: #{field} required") }
    if path.start_with?("_posts/")
      assert(path.match?(%r{_posts/\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md\z}), "#{path}: use YYYY-MM-DD-slug.md")
      Date.iso8601(File.basename(path)[0, 10])
    end
    if path.start_with?("_projects/")
      assert(data["order"].is_a?(Integer), "#{path}: integer order required")
      assert([true, false].include?(data["featured"]), "#{path}: featured must be boolean")
      assert(data["area"].is_a?(String), "#{path}: area required")
    end
    [path, data]
  end
  if ARGV.include?("--release")
    assert(profile["education_pending"] == false, "review education wording first")
    %w[github email].each { |field| assert(!profile[field].to_s.strip.empty?, "confirm #{field} first") }
    assert(profile["github"].match?(%r{\Ahttps://github\.com/[^/]+/?\z}), "use a confirmed GitHub profile URL")
    assert(profile["email"].match?(/\A[^@\s]+@[^@\s]+\.[^@\s]+\z/), "use a valid confirmed email")
    assert(profile["cv"].to_s.empty?, "keep CV unpublished until the user explicitly opts in")
    assert(!profile["avatar"].include?("placeholder"), "replace placeholder portrait")
    assert(experience.none? { |e| e["dates"].to_s.match?(/confirm|pending|TODO/i) || e["dates"].to_s.empty? }, "confirm experience dates")
    documents.reject { |p, d| p.start_with?("_drafts/") || d["published"] == false }.each do |path, data|
      assert(data["sample"] == false, "#{path}: review content and explicitly set sample: false")
      assert(!File.read(path).match?(/to be added|to confirm|pending review|replace this|example entry/i), "#{path}: unresolved example text")
    end
  end
  puts "PASS: #{paths.length} content files, profile, experience order and production defaults#{ARGV.include?("--release") ? ' (release gate)' : ''}."
end
