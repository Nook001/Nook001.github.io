# 内容维护指南

内容用 Markdown/YAML 维护，模板和 CSS 负责排版。新增条目不需要改主页或索引。

## 个人资料与经历

- `_data/profile.yml`：姓名、学历、头像及 alt、联系链接、简短问候/Currently。
  保留已确认的 `HKUST · CSE` 和 `University of Warwick · CS ’27`；事实依据见 CONTENT_SOURCES.md。
- CV 默认不公开，`cv` 保持空值；不添加 CV 入口、占位提示或文件。原始简历不入库。
- 学历条目使用 `label`、`logo`。经历使用 `company`、`role`、`logo`、`dates`，可选布尔值 `current`。
- 经历严格按 YAML 数组顺序显示，通常由新到旧；重叠任职不自动排序。不再限制公司名单或条数。
- 日期格式为 `Apr 2026 - Aug 2026`。持续任职用 `Sep 2026 - Present`，同时设置
  `current: true`；结束的任职省略 current 或设为 false。日期未知可暂留 `dates: ""`，发布检查会阻止。
- Logo 使用 `/assets/images/organizations/` 中的本地文件，来源写入 LOGO_SOURCES.md。
  相邻文字已说明机构名，Logo 为装饰图片，alt 为空。
- Publications 的标题和空轴是当前有意保留的设计。没有论文时不生成示例条目。
  增加真实论文前先审核事实与呈现方式，不预建不需要的数据系统。

## 两种草稿

| 类型 | 位置 | 网站输出 | GitHub 源文件 |
| --- | --- | --- | --- |
| 可以公开的工作草稿 | `_drafts/slug.md`，或 `published: false` | 生产构建排除 | 提交后公开可见 |
| 私人草稿、研究数据、简历 | `private-drafts/` 或仓库外 | Jekyll 显式排除 | Gitignore 默认忽略，禁止强制提交 |

Gitignore 不是加密，也不能隐藏已经跟踪/提交过的文件；验证会拒绝跟踪中的私人目录文件。
推送前仍要检查整个源文件差异，包括附件和图片。误提交隐私后应停止推送，报告情况；不要自行改写历史。

## 写文章

1. 从 `templates/post.md` 复制到 `_drafts/slug.md`。正文结构自由，标题由模板生成，正文从 `##` 开始。
2. 填 `title`、一句话 `description` 和 `lang`（英文 `en`、中文 `zh-CN`）。标题和摘要在列表中一起标注语言。
3. 本地用 `bundle exec jekyll serve --drafts` 审阅公开安全的草稿。私人草稿先在编辑器审阅，
   只把经过脱敏、允许公开的版本复制到 `_drafts/`；不修改排除规则来预览私人文件。
4. 确认事实后移到 `_posts/YYYY-MM-DD-slug.md`，去掉 `published: false` 或改为 true，
   明确设置 `sample: false`。日期取文件名，表示计划发布日期；不额外设置冲突的 front matter `date`。
5. 文章按日期从新到旧显示，首页取最近五篇；未来日期不会构建。移入 posts 不等于授权推送或发布。

另有待核实内容时使用 `review_pending: true`，发布检查会阻止；确认后才移除或设为 false。
检查不扫描正文中的普通词组来猜测审核状态，因此技术讨论中的 “pending review” 等用语不会误触发。

### 代码、表格与图片

- 围栏代码写明语言，例如三反引号后跟 `ruby`、`python`、`cpp`；普通文本用 `text`。
  Rouge 高亮与未高亮代码使用同一套随主题变化的代码表面。长代码在块内滚动，行内代码可折行。
- 使用标准 Markdown 表格及表头。模板为表格加可键盘聚焦的滚动容器，保留原生 table 语义。
  不把整个表格改为图片；列含义复杂时补充说明或 HTML caption。
- 图片放 `assets/images/`，使用有意义的 alt 和本地链接：
  `![图像内容]({{ '/assets/images/file.png' | relative_url }})`。
- 图片说明可在下一段加 `{:.image-caption}`；需要正式图注时使用
  `<figure markdown="1">`、Markdown 图片和 `<figcaption>说明</figcaption>`。
  先移除截图中的隐私，控制图片体积，不使用外链追踪图片。
- 长链接可折行；正文链接保留下划线。使用相对站点链接时加 `relative_url`。
- 修改文章样式时运行 `bundle exec ruby scripts/check_articles.rb`；测试文章只存在于忽略的 work 目录。

## 项目

复制 `templates/project.md` 到 `_projects/slug.md`。必填 title、description、area、整数 order 和
布尔 featured。`featured: true` 才进入首页，项目列表按 order 升序；建议使用不同 order。
`published: false` 不输出页面。上线前确认事实并设 `sample: false`。

只写可确认的问题、本人贡献、实现选择及证据；不猜测所有权、成效、仓库或上线状态。
未知 source_url 留空，project_url 可指向公开作品页。不要把私有源码链接当公开证据。

## 删除与审核

删除 Markdown 会移除页面与索引；删除已发布内容需用户明确要求，并评估旧链接。
本轮用户明确要求移除 Qingyin 播放事件短文；下次部署前该公开 URL 仍保持现状，部署后将返回 404。
发布步骤统一见 PUBLISHING.md，检查方法见 VALIDATION.md。
