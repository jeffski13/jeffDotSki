import React from 'react';

const SampleCompo = (props) => {
  return (
    <div>
      <div className="site-wrapper">

        <div className="site-wrapper-inner">

          <div className="cover-container">

            <div className="masthead clearfix">
              <div className="inner">
                <h3 className="masthead-brand">Cover</h3>
                <nav>
                  <ul className="nav masthead-nav">
                    <li className="active"><a href="#">Home</a></li>
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="inner cover">
              <h1 className="cover-heading">Cover your page.</h1>
              <p className="lead">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>
              <p className="lead">
                <a href="#" className="btn btn-lg btn-default">Learn more</a>
              </p>
            </div>

            <div className="mastfoot">
              <div className="inner">
                <p>Cover template for <a href="http://getbootstrap.com">Bootstrap</a>, by <a href="https://twitter.com/mdo">@mdo</a>.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SampleCompo;