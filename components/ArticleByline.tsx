import Link from 'next/link'
import { EDITORIAL_POLICY_PATH, reviewedDisplay } from '@/lib/editorialPolicy'
import { formatPostDate } from '@/lib/blog'

export type BylinePersonView = { name: string; href?: string | null; credentials?: string | null }

type Props = {
  author?: BylinePersonView | null
  reviewer?: BylinePersonView | null
  /** YYYY-MM-DD */
  lastReviewed?: string | null
  /** ISO 8601 */
  modifiedAt?: string | null
  /** Link to the editorial policy. Off until the policy is live, so the byline
   *  never links to a page that 404s. */
  showPolicyLink: boolean
}

function Person({ person, rel }: { person: BylinePersonView; rel?: string }) {
  const label = person.credentials ? `${person.name}, ${person.credentials}` : person.name
  return person.href ? (
    <Link href={person.href} rel={rel}>
      {label}
    </Link>
  ) : (
    <>{label}</>
  )
}

/**
 * The byline under a post's H1 (editorial policy package, article-byline.html).
 *
 * The reviewer line renders only when the post has both a reviewer and a
 * review date of its own. There is no fallback reviewer, by design.
 */
export default function ArticleByline({
  author,
  reviewer,
  lastReviewed,
  modifiedAt,
  showPolicyLink,
}: Props) {
  const reviewedOn = lastReviewed ? reviewedDisplay(lastReviewed) : ''
  const updated = formatPostDate(modifiedAt ?? null)
  const meta = [
    reviewedOn ? (
      <span key="reviewed">
        Last reviewed <time dateTime={lastReviewed!}>{reviewedOn}</time>
      </span>
    ) : null,
    updated ? (
      <span key="updated">
        Updated <time dateTime={modifiedAt!}>{updated}</time>
      </span>
    ) : null,
    showPolicyLink ? (
      <Link key="policy" href={EDITORIAL_POLICY_PATH}>
        Editorial policy
      </Link>
    ) : null,
  ].filter(Boolean)

  if (!author && !meta.length) return null

  return (
    <div className="article-byline">
      {author ? (
        <p className="byline-line">
          Written by <Person person={author} rel="author" />
        </p>
      ) : null}
      {reviewer && reviewedOn ? (
        <p className="byline-line">
          Clinically reviewed by <Person person={reviewer} />
        </p>
      ) : null}
      {meta.length ? (
        <p className="byline-meta">
          {meta.flatMap((node, i) => (i ? [' · ', node] : [node]))}
        </p>
      ) : null}
    </div>
  )
}
