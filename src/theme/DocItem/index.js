import React from 'react';
import DocItem from '@theme-original/DocItem';
import { DiscussionEmbed } from 'disqus-react'

const githubPagesUrl = 'https://site.asyncraft.club'

export default function DocItemWrapper(props) {
  const { metadata } = props.content
  const { frontMatter, slug, title } = metadata
  const { comments = false } = frontMatter

  return (
    <>
      <DocItem {...props} />
      {comments && (<DiscussionEmbed
        shortname='asyncraft'
        config={{
          url: githubPagesUrl + slug,
          identifier: slug,
          title: title,
          language: 'zh_CN',
        }}
      />)}
      
    </>
  );
}
