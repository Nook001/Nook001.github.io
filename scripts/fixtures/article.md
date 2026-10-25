This is **temporary layout verification**, not a published article. 中文与 English 混排：标点、强调、链接和代码均应保持可读。

## Headings and paragraphs / 标题与段落

Technical writing can include a very long address such as <https://example.com/a/very/long/technical/reference/with/many/segments/that/should/wrap/without/stretching/the/reading/column> and inline code like `a_very_long_identifier_without_spaces_that_must_wrap_on_a_narrow_phone_without_breaking_the_page_width`.

中文技术文章需要正常的行距和段落间距。事件、状态与异步任务之间的关系应当清楚；这里不强制文章采用固定的正文结构。中文技术文章需要正常的行距和段落间距。事件、状态与异步任务之间的关系应当清楚。

### Lists and nested lists

1. Establish the context.
2. Explain the decision.
   - A nested observation.
   - Another observation with `inline_code`.
3. Link the evidence: [selected projects]({{ '/projects/' | relative_url }}).

#### A smaller heading

> A quotation should be distinct without becoming a new card.
>
> 引用中的多个段落也需要保留层级。

---

## Code / 代码

```ruby
# Long lines scroll inside the code block.
class PlaybackSession
  def apply(event)
    return false unless event.generation == @generation
    @status = "A deliberately long line for checking horizontal scrolling without changing the width of the surrounding article, even at 320 CSS pixels."
    puts(event.position + 42)
    true
  end
end
```

```diff
- previous state
+ current state
```

```text
An unhighlighted block should use the same spacing and scroll behavior as highlighted code.
```

## Tables / 表格

| State | Generation | Position | Source | Clock | Duration | Transition | Result | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Playing | current | 120 | pipeline | monotonic | 240 | next | accepted | Current event |
| Stopped | previous | 60 | worker | monotonic | 120 | none | ignored | Older event |

## Images / 图片

<figure markdown="1">
![A neutral avatar placeholder used only to verify image sizing.]({{ '/assets/images/avatar-placeholder.svg' | relative_url }})
<figcaption>Figure 1 / 图 1：本地图片和说明，不使用外部追踪图片。</figcaption>
</figure>

## Closing paragraph / 结尾

The heading, date, description and body should read as separate levels. No table of contents, reading progress script or animation is necessary.
