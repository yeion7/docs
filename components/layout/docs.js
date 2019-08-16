import React from 'react'
import Link from 'next/link'
import { useAmp } from 'next/amp'
import { withRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/tag'

import * as bodyLocker from '~/lib/utils/body-locker'
import Head from '~/components/layout/head'
import Layout from '~/components/layout/layout'
import Main from '~/components/layout/main'
import Heading from '~/components/text/linked-heading'
import Sidebar from '~/components/layout/sidebar'
import Content from '~/components/layout/content'
import ContentFooter from '~/components/layout/content-footer'
import DocsNavbarDesktop from '~/components/layout/navbar/desktop'
import ToggleGroup, { ToggleItem } from '~/components/toggle-group'
import { GenericLink } from '~/components/text/link'
import components from '~/lib/mdx-components'
import { H1, H2, H3, H4 } from '~/components/text'
import HR from '~/components/text/hr'
import dataV1 from '~/lib/data/v1/docs'
import dataV2 from '~/lib/data/v2/docs'
import Select from '~/components/select'
import Note from '~/components/text/note'
import { FooterFeedback } from '~/components/feedback-input'

const DocH1 = ({ children }) => (
  <>
    <Heading noAnchor lean offsetTop={175}>
      <H1>{children}</H1>
    </Heading>
    <style jsx>{`
      :global(h1) {
        margin: 0;
      }
    `}</style>
  </>
)

const DocH2 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H2>{children}</H2>
    </Heading>
    <style jsx>{`
      :global(h2) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const DocH3 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H3>{children}</H3>
    </Heading>
    <style jsx>{`
      :global(h3) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const DocH4 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H4>{children}</H4>
    </Heading>
    <style jsx>{`
      :global(h4) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const NonAmpOnly = ({ children }) => (useAmp() ? null : children)

const VersionSelect = ({ onChange, version }) => {
  const isAmp = useAmp()
  const href = `/docs/${version === 'v1' ? 'v2' : 'v1'}`
  const curSelect = (
    <Select
      width="100%"
      onChange={onChange}
      defaultValue={version}
      on={
        isAmp ? `change:AMP.navigateTo(url='${href}', target=_top)` : undefined
      }
    >
      <option value="v1">1.0</option>
      <option value="v2">2.0 (Latest)</option>
    </Select>
  )
  if (!isAmp) return curSelect
  // have to wrap it in a form to use `autoComplete="off"`
  return (
    <form action="/" method="GET" autoComplete="off" target="_top">
      {curSelect}
    </form>
  )
}

class withDoc extends React.Component {
  state = {
    navigationActive: false,
    version: this.props.router.asPath.split(/(v[0-9])/)[1] || 'v2'
  }

  handleVersionChange = event => {
    const href = `/docs/${event.target.value}`
    this.props.router.push(href)
    this.handleIndexClick()
  }

  handleIndexClick = () => {
    if (this.state.navigationActive) {
      bodyLocker.unlock()
      this.setState({
        navigationActive: false
      })
    }
  }

  render() {
    const {
      router,
      meta = {
        title: 'Now Documentation',
        description:
          'The knowledge base and documentation for how to use ZEIT Now and how it works.'
      }
    } = this.props
    const { navigationActive, version } = this.state
    const versionData = version === 'v2' ? dataV2 : dataV1

    return (
      <MDXProvider
        components={{
          ...components,
          h2: DocH2,
          h3: DocH3,
          h4: DocH4
        }}
      >
        <Layout dynamicSearch={false} data={versionData}>
          <Head
            titlePrefix=""
            titleSuffix=" - ZEIT Documentation"
            title={`${meta.title}`}
            description={meta.description}
            image={meta.image}
            lastEdited={meta.lastEdited}
          >
            {version !== 'v2' && <meta name="robots" content="noindex" />}
          </Head>

          <Main>
            <Sidebar active={navigationActive}>
              <div className="toggle-group-wrapper">
                <ToggleGroup>
                  <ToggleItem
                    active={
                      router.pathname.startsWith('/docs') &&
                      !router.pathname.startsWith('/docs/api')
                    }
                  >
                    <Link prefetch href="/docs">
                      <a onClick={this.handleIndexClick}>Docs</a>
                    </Link>
                  </ToggleItem>
                  <ToggleItem active={router.pathname.startsWith('/docs/api')}>
                    <Link prefetch href="/docs/api">
                      <a onClick={this.handleIndexClick}>API Reference</a>
                    </Link>
                  </ToggleItem>
                  <ToggleItem active={router.pathname.startsWith('/examples')}>
                    <Link prefetch href="/examples">
                      <a onClick={this.handleIndexClick}>Examples</a>
                    </Link>
                  </ToggleItem>
                </ToggleGroup>
              </div>

              <DocsNavbarDesktop data={versionData} url={router} />

              <h5 className="platform-select-title">Now Platform Version</h5>
              <VersionSelect
                version={version}
                onChange={this.handleVersionChange}
              />
            </Sidebar>
            <Content>
              <div className="heading content-heading">
                {version === 'v1' && (
                  <Note>
                    This documentation is for <b>version 1</b> of the Now
                    platform. For the latest features, please see{' '}
                    <GenericLink href="/docs/v2">
                      the version 2 documentation
                    </GenericLink>
                    . If you have yet to upgrade, see the{' '}
                    <GenericLink href="/guides/upgrade-to-2-0">
                      upgrade guide
                    </GenericLink>
                    .
                  </Note>
                )}
                <DocH1>{meta.title}</DocH1>
              </div>

              <div className="content">{this.props.children}</div>

              <NonAmpOnly>
                <>
                  <HR />
                  <FooterFeedback />
                </>
              </NonAmpOnly>

              <ContentFooter
                lastEdited={meta.lastEdited}
                editUrl={meta.editUrl}
              />
            </Content>
          </Main>

          <style jsx>{`
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }

            .category-wrapper {
              padding: 40px 0;
            }

            .category-wrapper:not(:last-child) {
              border-bottom: 1px solid #eaeaea;
            }

            .platform-select-title {
              font-size: var(--font-size-primary);
              line-height: var(--line-height-primary);
              font-weight: 400;
              margin-bottom: 16px;
              margin-top: 32px;
            }

            .toggle-group-wrapper {
              display: none;
            }

            @media screen and (max-width: 950px) {
              .toggle-group-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 40px;
              }
            }
          `}</style>
        </Layout>
      </MDXProvider>
    )
  }
}

export default withRouter(withDoc)
