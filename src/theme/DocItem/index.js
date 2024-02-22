import React from 'react';
import DocItem from '@theme-original/DocItem';
import Giscus from '@giscus/react';


export default function DocItemWrapper(props) {
  const { metadata } = props.content
  const { frontMatter, slug, title } = metadata
  const { comments = false } = frontMatter

  return (
    <>
      <DocItem {...props} />
      {comments && (
        <div>
          <Giscus
            id="comments"
            // highlight-warn-start
            repo="Async-Lab/Asyncraft"
            repoId="R_kgDOJjWTSg"
            category="Comments"
            categoryId="DIC_kwDOJjWTSs4CdYHH"
            // highlight-warn-end
            mapping="title"
            strict="1"
            term="Welcome to @giscus/react component!"
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="top"
            theme="transparent_dark"
            lang="zh-CN"
            loading="lazy"
          />
        </div>
      )}

    </>
  );
}
