import NavigationBar from "./NavigationBar";
import React from 'react';
import '../styles.css';
import DevEnvBanner from "./DevEnvBanner";
import { getEnv } from "./env";
import { THEME, getThemeManagerImpl } from "./darkTheme";

interface ComponentWithProps { }


/**
 * HOC that has the navbar, etc for the webside content.
 * @param PageContent the content of the page
 * @returns the page with the common website components.
 */
const jeffDotSkiPage = <P extends object>(PageContent: React.ComponentType<P>) =>

  class JeffSkiPageWithContent extends React.Component<P & ComponentWithProps> {

    render() {
      const { ...props } = this.props;
      return (
        <div id="App" >
          <NavigationBar themeManager={getThemeManagerImpl()}
           />
          <div className="webpagecontent">
            <PageContent {...props} />
          </div>
          <DevEnvBanner env={getEnv()} />
        </div>
      );
    }
  }

export default jeffDotSkiPage;