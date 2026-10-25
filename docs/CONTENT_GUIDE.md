# 内容维护指南

日常操作可直接交给 Codex：说明要增加、修改或删除的文章/项目，以及已确认的事实。Markdown 负责内容，模板负责排版。

## 个人资料

`_data/profile.yml` 管理姓名、两行教育经历、问候语、头像、GitHub 和 Email。GitHub 填完整 HTTPS 个人主页；Email 只填地址。用户已确认学历显示为 `HKUST · CSE` 和 `University of Warwick · CS ’27`，`education_pending` 为 false。头像使用用户 GitHub 账号的公开头像，后续可按要求替换并更新 alt。

用户要求暂不公开 CV。保持 `cv` 为空，首页不显示 CV 入口或待补充提示；原 CV 页面已删除。发布检查会阻止 CV 链接及生成的 CV 页面。只有用户明确要求恢复时才能修改该规则并添加经过审阅的公开版本。原始 DOCX 不入库。

经历在 `_data/experience.yml`，保留 HKUST(GZ) → Tencent → CAS → Shopee → OPPO 顺序。用户确认 HKUST(GZ) Research Assistant 从 2026-09 持续至今，用 `current: true` 显示实心节点，日期为 `2026-09 - Present`；Tencent 职位为 Solution Architect。日期由用户确认，不推测月份或职位性质。日期位于卡片右上角；窄屏上独占首行，避免与公司名称重叠。

学历现在使用 `label` / `logo` 条目：`label` 保留已确认的文字，`logo` 是本地图片路径。经历条目同样使用 `logo` 指定标识。文件放在 `assets/images/organizations/`，来源记录在 LOGO_SOURCES.md；替换时保持原始比例，不用外部图标服务。标识旁已有学校/公司文字，因此图片按装饰处理，避免读屏重复播报。

## 文章

1. 从 `templates/post.md` 复制到 `_drafts/slug.md`，写标题、摘要、语言和正文。
2. 在本地草稿预览中审阅。不要添加未经证实的履历或成果；技术结论应给出前提和证据。
3. 内容确认后移到 `_posts/YYYY-MM-DD-slug.md`，日期代表真实计划发布日期。删除 `published: false` 或设为 true。确认不是示例后明确设 `sample: false`。
4. 运行检查、看桌面和手机宽度，再准备 PR。移入 posts 只代表可构建，不授权发布。

中文文章用 `lang: zh-CN`，模板会在正文页面设置对应语言。代码块写明语言；图片提供 alt，放 `assets/images/`，路径使用 Liquid `relative_url`，例如 `![说明]({{ '/assets/images/example.png' | relative_url }})`。避免大图和外链追踪资源。

## 项目

从 `templates/project.md` 复制到 `_projects/slug.md`。`featured: true` 才会出现在首页；`order` 数值越小越靠前。`area` 只是一条简短分类，不堆砌技能标签。`published: false` 的条目不进入生产站点。

只写能确认的问题、本人贡献、实现选择和证据。项目名称不等于已确认的所有权或上线状态。`source_url` 不确定时留空；不要凭名称猜仓库。`project_url` 可链接到公开作品页。当前三张卡片已按代码、简历和公开资料补齐，来源见 CONTENT_SOURCES.md。私有仓库不要作为公众可访问的源码链接。

## 删除与安全

删除文章/项目 Markdown 文件会同步移除列表项；发布前检查是否需要兼容旧链接。本次从空仓库开始，没有承诺任何旧 URL 重定向。内部链接检查会发现本站残留引用。

不要把联系方式、CV 或草稿中不希望公开的信息提交到未来的公开仓库。`published: false` 只控制网页输出，不能隐藏 GitHub 仓库中的源文件。
