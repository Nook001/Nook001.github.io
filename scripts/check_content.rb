require "yaml"
require "date"
require "open3"

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
  data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false)
  assert(data.is_a?(Hash), "#{path}: front matter must be a mapping")
  data
end

def required_text(data, field, context)
  assert(data[field].is_a?(String) && !data[field].strip.empty?, "#{context}: #{field} required")
end

def local_image(path, context, prefix = "/assets/images/")
  assert(path.is_a?(String) && path.start_with?(prefix), "#{context}: use a local image under #{prefix}")
  resolved = File.expand_path(path.delete_prefix("/"), ROOT)
  assert(resolved.start_with?(File.join(ROOT, prefix.delete_prefix("/"))) && File.file?(resolved), "#{context}: image missing or outside allowed directory: #{path}")
end

# Display dates remain a single author-friendly field. Array order is editorial,
# usually newest first; overlapping roles do not require automatic sorting.
def check_dates(item, context)
  assert(item["dates"].is_a?(String), "#{context}: dates must be text")
  assert(!item.key?("current") || [true, false].include?(item["current"]), "#{context}: current must be boolean")
  return if item["dates"].empty? # Allowed locally; release gate requires confirmed dates.
  months = %w[Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec]
  date = "(?:#{months.join('|')}) \\d{4}"
  match = item["dates"].match(/\A(#{date}) - (#{date}|Present)\z/)
  assert(match, "#{context}: use Mon YYYY - Mon YYYY or Mon YYYY - Present")
  assert((match[2] == "Present") == (item["current"] == true), "#{context}: Present and current: true must agree")
  start_date = Date.strptime(match[1], "%b %Y")
  assert(match[2] == "Present" || start_date <= Date.strptime(match[2], "%b %Y"), "#{context}: end date precedes start")
end

Dir.chdir(ROOT) do
  config = read_yaml("_config.yml")
  profile = read_yaml("_data/profile.yml")
  experience = read_yaml("_data/experience.yml")
  assert(config["future"] == false && config["show_drafts"] == false, "production must exclude drafts/future posts")
  assert(experience.is_a?(Array), "experience must be an ordered YAML list (use [] if empty)")
  experience.each_with_index do |item, index|
    context = "experience entry #{index + 1}"
    assert(item.is_a?(Hash), "#{context}: expected a mapping")
    %w[company role].each { |field| required_text(item, field, context) }
    check_dates(item, context)
  end
  local_image(profile["avatar"], "avatar")
  required_text(profile, "avatar_alt", "profile")
  profile.fetch("education").each do |item|
    assert(item["label"].is_a?(String) && !item["label"].empty?, "education label missing")
  end
  (profile.fetch("education") + experience).each do |item|
    local_image(item["logo"], "organization logo", "/assets/images/organizations/")
  end
  assert(config.fetch("exclude").include?("private-drafts"), "private drafts must be excluded from Jekyll")
  ignored, status = Open3.capture2("git", "check-ignore", "--no-index", "private-drafts/privacy-check.md")
  assert(status.success? && !ignored.strip.empty?, "private-drafts/ must be Git-ignored")
  tracked, status = Open3.capture2("git", "ls-files", "--", "private-drafts")
  assert(status.success? && tracked.empty?, "private drafts are tracked; stop and review exposure (ignore rules cannot hide tracked files)")
  paths = Dir["_posts/**/*.md", "_drafts/**/*.md", "_projects/**/*.md"]
  documents = paths.map do |path|
    data = front_matter(path)
    %w[title description].each { |field| required_text(data, field, path) }
    %w[published sample review_pending].each do |field|
      assert(!data.key?(field) || [true, false].include?(data[field]), "#{path}: #{field} must be boolean")
    end
    if path.start_with?("_posts/", "_drafts/")
      assert(data["lang"].is_a?(String) && data["lang"].match?(/\A[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*\z/), "#{path}: lang required, e.g. en or zh-CN")
      assert(!data.key?("layout") || data["layout"] == "post", "#{path}: use the post layout")
    end
    if path.start_with?("_posts/")
      assert(File.basename(path).match?(/\A\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md\z/), "#{path}: use YYYY-MM-DD-slug.md")
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
      assert(data["review_pending"] != true, "#{path}: resolve the pending content review first")
    end
  end
  puts "PASS: #{paths.length} content files, profile, #{experience.length} experience entries and draft/privacy defaults#{ARGV.include?("--release") ? ' (release gate)' : ''}."
end
