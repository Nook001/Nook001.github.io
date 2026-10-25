# Build synthetic articles in an ignored, isolated source tree. Nothing is added
# to the real _posts directory or uploaded. The resulting site is kept for review.
require "jekyll"
require "fileutils"
require "tmpdir"
require "open3"
require "date"

root = File.expand_path("..", __dir__)
work = File.join(root, "work")
FileUtils.mkdir_p(work)
run = Dir.mktmpdir("article-check-", work)
source = File.join(run, "source")
destination = File.join(run, "site")
FileUtils.mkdir_p(source)
%w[_config.yml .gitignore _layouts _includes _data _projects _posts _drafts assets scripts].each do |entry|
  path = File.join(root, entry)
  FileUtils.cp_r(path, source) if File.exist?(path)
end
Dir[File.join(root, "*.html")].each { |path| FileUtils.cp(path, source) }
%w[_posts _drafts private-drafts].each { |dir| FileUtils.mkdir_p(File.join(source, dir)) }
body = File.read(File.join(root, "scripts/fixtures/article.md"), encoding: "UTF-8")
%w[en zh-CN].each do |lang|
  title = lang == "en" ? "Article layout verification" : "中文技术文章排版验证"
  post = "---\ntitle: #{title}\ndescription: Temporary bilingual typography verification.\nlang: #{lang}\nsample: false\n---\n\n#{body}"
  File.write(File.join(source, "_posts/2000-01-01-layout-#{lang.downcase}.md"), post, encoding: "UTF-8")
end
sentinel = "---\ntitle: Isolation sentinel\ndescription: Must stay out of production.\nlang: en\nsample: false\n%s---\nDRAFT_ISOLATION_SENTINEL\n"
File.write(File.join(source, "_drafts/hidden-draft.md"), sentinel % "")
File.write(File.join(source, "_posts/2000-01-02-unpublished.md"), sentinel % "published: false\n")
File.write(File.join(source, "_posts/2099-01-01-future.md"), sentinel % "")
File.write(File.join(source, "private-drafts/private.html"), "PRIVATE_DRAFT_SENTINEL")
File.write(File.join(source, "_projects/hidden-project.md"), "---\ntitle: PROJECT_ISOLATION_SENTINEL\ndescription: Unpublished project.\narea: Test\norder: 999\nfeatured: true\nsample: false\npublished: false\n---\nPROJECT_ISOLATION_SENTINEL\n")

ENV["JEKYLL_ENV"] = "production"
Dir.chdir(source) do
  config = Jekyll.configuration("config" => "_config.yml", "source" => source,
                                "destination" => destination, "quiet" => true)
  Jekyll::Site.new(config).process
end
def check(condition, message)
  abort "FAIL: #{message}" unless condition
end
%w[en zh-cn].each do |slug|
  html = File.read(File.join(destination, "blog/2000/01/01/layout-#{slug}/index.html"), encoding: "UTF-8")
  lang = slug == "en" ? "en" : "zh-CN"
  check(html.include?(%(<html lang="#{lang}">)), "article language #{lang}")
  check(html.include?('<span class="k">') && html.include?('<span class="s2">'), "Rouge token output")
  check(html.include?('<h2 id=') && html.include?('<blockquote>') && html.include?('<figure>'), "Markdown structure")
  check(html.include?('<table>') && html.include?('class="table-scroll"') && html.include?('tabindex="0"'), "scrollable semantic table")
  check(html.include?('<figcaption>') && html.include?('alt="A neutral avatar'), "image and caption")
  check(html.include?('class="post-description"'), "article summary")
  %w[index.html blog/index.html feed.xml].each do |file|
    check(File.read(File.join(destination, file), encoding: "UTF-8").include?("layout-#{slug}"), "article missing from #{file}")
  end
end
Dir[File.join(destination, "**/*")].select { |f| File.file?(f) && %w[.html .xml].include?(File.extname(f)) }.each do |file|
  check(!File.read(file).include?("ISOLATION_SENTINEL"), "draft/future/private content leaked into #{file}")
end
check(!Dir.exist?(File.join(destination, "private-drafts")), "private draft directory leaked")
check(system("python", File.join(root, "scripts/check_site.py"), destination), "generated fixture site")

# Verify the content gate accepts ordinary content evolution and rejects errors.
# A nested temporary Git repo makes ignore/tracked-file checks realistic.
def command!(*args, chdir:)
  out, status = Open3.capture2e(*args, chdir: chdir)
  abort out unless status.success?
end
command!("git", "init", "--quiet", chdir: source)
# Isolate gate regression tests from the real site's review status. Do not turn
# a legitimate work-in-progress article/project into an unrelated CI failure.
Dir[File.join(source, "{_posts,_projects}/**/*.md")].each do |file|
  next if File.basename(file).start_with?("2000-01-01-layout-")
  text = File.read(file, encoding: "UTF-8")
  text = text.match?(/^published:/) ? text.sub(/^published:.*$/, "published: false") : text.sub(/\A---\r?\n/, "---\npublished: false\n")
  File.write(file, text)
end
fixture_profile_path = File.join(source, "_data/profile.yml")
fixture_profile = YAML.safe_load(File.read(fixture_profile_path))
fixture_profile.merge!("education_pending" => false, "github" => "https://github.com/fixture",
                       "email" => "fixture@example.com", "cv" => "", "avatar" => "/assets/images/fixture.svg")
File.write(File.join(source, "assets/images/fixture.svg"), '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#486344"/></svg>')
File.write(fixture_profile_path, fixture_profile.to_yaml)
def gate(source, expected, label, *flags)
  out, status = Open3.capture2e(RbConfig.ruby, "scripts/check_content.rb", *flags, chdir: source)
  check(status.success? == expected, "#{label}: #{out}")
end
experience_path = File.join(source, "_data/experience.yml")
original = File.read(experience_path)
entries = YAML.safe_load(original)
fixture_entry = {"company" => "Schema-only test organization", "role" => "Engineer",
                 "dates" => "Jun 2025 - Sep 2025", "logo" => "/assets/images/organizations/fixture.svg"}
FileUtils.cp(File.join(source, "assets/images/fixture.svg"), File.join(source, "assets/images/organizations/fixture.svg"))
entries << fixture_entry.dup
File.write(experience_path, entries.to_yaml)
gate(source, true, "additional experience and editorial order accepted")
entries.last["current"] = "false"
File.write(experience_path, entries.to_yaml)
gate(source, false, "string current rejected")
entries.last.delete("current")
entries.last["dates"] = "Sep 2025 - Jun 2025"
File.write(experience_path, entries.to_yaml)
gate(source, false, "reversed dates rejected")
entries.last["dates"] = "2025-09"
File.write(experience_path, entries.to_yaml)
gate(source, false, "invalid date format rejected")
entries.last["dates"] = "Sep 2025 - Present"
File.write(experience_path, entries.to_yaml)
gate(source, false, "Present without current rejected")
entries.last["dates"] = "Jun 2025 - Sep 2025"
entries.last["logo"] = "/assets/images/organizations/missing.png"
File.write(experience_path, entries.to_yaml)
gate(source, false, "missing logo rejected")
File.write(experience_path, [fixture_entry].to_yaml)
gate(source, true, "release fixtures", "--release")
profile_path = File.join(source, "_data/profile.yml")
profile_original = File.read(profile_path)
profile = YAML.safe_load(profile_original)
profile["cv"] = "/cv.pdf"
File.write(profile_path, profile.to_yaml)
gate(source, false, "CV rejected", "--release")
File.write(profile_path, profile_original)
sample_path = File.join(source, "_posts/2000-01-01-layout-en.md")
sample_original = File.read(sample_path)
File.write(sample_path, sample_original.sub("sample: false", "sample: true"))
gate(source, false, "unreviewed sample rejected", "--release")
File.write(sample_path, sample_original)
File.write(sample_path, sample_original.sub("sample: false", "sample: false\nreview_pending: true"))
gate(source, false, "pending review rejected", "--release")
File.write(sample_path, sample_original)
command!("git", "add", "--force", "private-drafts/private.html", chdir: source)
gate(source, false, "tracked private draft rejected")

puts "PASS: two bilingual article fixtures, Rouge/Markdown/images/listing, draft isolation and content-gate regression checks."
puts "Review-only fixture site: #{destination}"
