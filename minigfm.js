class MiniGFM {
  constructor(t) {
    this.options = t || {}
  }
  parse(t) {
    if ('string' != typeof t) return ''
    let s = [],
      n = []
    return (
      (t = this.t(
        this.i(
          t
            .replace(
              /(?:^|\n)[^\\]?(`{3,4})[ ]*(\w*?)\n([\s\S]*?)\n\1/g,
              (t, e, r, n) => (s.push({ lang: r.trim(), code: n.trim() }), `<!----CODEBLOCK${s.length - 1}---->`),
            )
            .replace(/([^\\])`([^`]+)`/g, (t, e, r) => (n.push(this.l(r)), `${e}<!----CODEINLINE${n.length - 1}---->`))
            .replace(/\\([\\*_{}[\]()#+\-.!`])/g, (t, e) => '&#' + e.charCodeAt(0))
            .replace(/%%[\n ][^%]+[\n ]%%/g, ''),
        ),
      )
        .replace(/<!----CODEINLINE(\d+)---->/g, (t, e) => (n[e] ? `<code>${n[e]}</code>` : ''))
        .replace(/<!----CODEBLOCK(\d+)---->/g, (t, e) => {
          if (!s[e]) return ''
          var { lang: e, code: r } = s[e]
          let n = r
          if (this.options.hljs)
            try {
              n = (e ? this.options.hljs.highlight(r, { language: e }) : this.options.hljs.highlightAuto(r)).value
            } catch {}
          return e
            ? `<pre lang="${e}"><code class="hljs ${e} lang-${e}">${n}</code></pre>`
            : `<pre><code>${n}</code></pre>`
        })),
      this.options.unsafe ? t : this.$(t)
    )
  }
  i(t) {
    return t
      .replace(/^[^\\]?\s*(#{1,6}) ([^\n]+)$/gm, (t, e, r) => `<h${e.length}>${r}</h${e.length}>`)
      .replace(
        /^[ \t]*[-\*\+][ \t]+\[([ ]*[ xX]?)\]\s([^\n]+)$/gm,
        (t, e, r) =>
          `<li><input type="checkbox" ${'x' === e.trim().toLowerCase() ? 'checked' : ''} disabled> ${r}</li>`,
      )
      .replace(/^[ \t]*[-\*\+] ([^\n]+)$/gm, '<li>$1</li>')
      .replace(/^[ \t]*(\d+\.) ([^\n]+)$/gm, '<li>$1 $2</li>')
      .replace(/^ {0,3}(([*_-])( *\2 *){2,})(?:\s*$|$)/gm, () => '<hr/>')
      .replace(/^[ \t]*((?:\>[ \t]*)+)([^\n]*)$/gm, (t, e, r) => {
        e = e.length / 2
        return '' === r.trim() ? '' : '<blockquote>'.repeat(e) + r + '</blockquote>'.repeat(e)
      })
      .replace(/^([^\n]*\|[^\n]*)\n([-:| ]+\|)+[-\| ]*\n((?:[^\n]*\|[^\n]*(?:\n|$))*)/gm, (t, e, r, n) =>
        this.g(e, r, n),
      )
      .split(/\n{2,}|\\\n/g)
      .map(t => (/^<(\w+)/.test(t) ? t : `<p>${t}</p>`))
      .join('<br />')
  }
  g(t, e, r) {
    let n = t
        .split('|')
        .map(t => t.trim())
        .filter(Boolean),
      s = this.o(e)
    t = r
      .trim()
      .split('\n')
      .reduce((t, e) => {
        if (e.includes('|')) {
          let r = e
            .split('|')
            .slice(1, -1)
            .map(t => t.trim())
          t.push(n.map((t, e) => r[e] || ''))
        }
        return t
      }, [])
    let a = ['<table>', '<thead><tr>']
    return (
      n.forEach((t, e) => {
        a.push(`<th${s[e] ? ` align="${s[e]}"` : ''}>${t}</th>`)
      }),
      a.push('</tr></thead>'),
      t.length &&
        (a.push('<tbody>'),
        t.forEach(t => {
          a.push('<tr>', ...t.map((t, e) => `<td${s[e] ? ` align="${s[e]}"` : ''}>${t}</td>`), '</tr>')
        }),
        a.push('</tbody>')),
      [...a, '</table>'].join('')
    )
  }
  o(t) {
    return t
      .split('|')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => {
        var e = t.startsWith(':'),
          t = t.endsWith(':')
        return e && t ? 'center' : e ? 'left' : t ? 'right' : null
      })
  }
  t(t) {
    return t
      .replace(/[\*\_]{2}(.+?)[\*\_]{2}/g, '<strong>$1</strong>')
      .replace(/(?<!\*)_(.+?)_(?!\*)|(?<!\*)\*(.+?)\*(?!\*)/, (t, e, r) => `<em>${e || r}</em>`)
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/\<([^\s@\>]+@[^\s@\>]+\.[^\s@\>]+)\>/g, '<a href="mailto:$1">$1</a>')
      .replace(/\<((?:https?:\/\/|ftp:\/\/|mailto:|tel:)[^\>\s]+)\>/g, '<a href="$1">$1</a>')
      .replace(/\!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(
        /\[([^\]]+)\]\(([^\) ]+)[ ]?(\"[^\)\"]+\")?\)/g,
        (t, e, r, n) => `<a href="${r}"${n ? ' title=' + n : ''}>${e}</a>`,
      )
  }
  l(t) {
    return t.replace(/[&<>"']/g, t => '&#' + t.charCodeAt(0))
  }
  $(t) {
    return t
      .replace(/<(\/?)\s*(script|iframe|object|embed|frame|link|meta|style|svg|math)[^>]*>/gi, t => this.l(t))
      .replace(/\s(?!data-)[\w-]+=\s*["'\s]*(javascript:|data:|expression:)[^"'\s>]*/gi, '')
      .replace(/\<[^\>]+\>/g, t => t.replace(/\s+on\w+\s*=\s*["']?[^"'\\]*["']?/gi, ''))
  }
}
'object' == typeof exports && (module.exports = { MiniGFM: MiniGFM })
