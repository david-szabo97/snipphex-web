import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import AppBar from './app-bar';
import SideBar from './side-bar';
import Home from './routes/home';
import Paste from './routes/paste';
import Settings from './routes/settings';
import About from './routes/about';
import Store from 'store';

export default class App extends Component {
  constructor() {
    super();

    window.store = Store;
    this.state = {
      sideBarLeftToggle: false,
      sideBarRightToggle: false
    };

    Store.listen(() => this.forceUpdate());
  }

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;

    let ga = window['GoogleAnalyticsObject'];
    if (ga) {
      ga('set', 'page', e.url);
      ga('send', 'pageview');
    }
  };

  onSideBarLeftToggle = () => {
    this.setState({ sideBarLeftToggle: !this.state.sideBarLeftToggle });
  }

  onSideBarRightToggle = () => {
    this.setState({ sideBarRightToggle: !this.state.sideBarRightToggle });
  }

  componentDidMount() {
    // Wait for next frame, ensure that app is rendered to the real DOM
    window.requestAnimationFrame(() => {
      const ele = document.getElementById('splash');
      ele.style.opacity = 0;

      document.getElementById('app').style.display = 'flex';
    });

    // Default sidebar (menu)
    Store.sideBars.left.title = 'SnippHex';
    Store.sideBars.left.children = [
      <div class="menu-row" onClick={this.routeHome}>Upload</div>,
      <div class="menu-row" onClick={this.routeSettings}>Settings</div>,
      <div class="menu-row" onClick={this.routeAbout}>About</div>
    ];

    // I have no idea why this doesn't work without raf =(
    window.requestAnimationFrame(() => Store.update());

    document.addEventListener('touchstart', function removeTouchClass() {
      document.documentElement.classList.remove('no-touch');
      document.removeEventListener('touchstart', removeTouchClass, false);
    }, false);
  }

  routeHome = () => {
    this.setState({ sideBarLeftToggle: false });
    route('/');
  }

  routeSettings = () => {
    this.setState({ sideBarLeftToggle: false });
    route('/settings');
  }

  routeAbout = () => {
    this.setState({ sideBarLeftToggle: false });
    route('/about');
  }

  render() {
    let classes = ['app'];
    if (this.state.sideBarLeftToggle) classes.push('side-bar-left-toggle');
    if (this.state.sideBarRightToggle) classes.push('side-bar-right-toggle');

    document.title = 'SnippHex' + ((Store.title) ? ' - ' + Store.title : '');

    return (
      <div id="app" class={classes.join(' ')}>
        <div class="dimmer" />
        <AppBar rightSideBarToggleIcon={Store.appBar.rightSideBarIcon} onSideBarLeftToggle={this.onSideBarLeftToggle} onSideBarRightToggle={this.onSideBarRightToggle} rightMenuIcons={Store.appBar.rightMenuIcons} />
        <SideBar left={true} title={Store.sideBars.left.title}>{Store.sideBars.left.children}</SideBar>
        <SideBar right={true} title={Store.sideBars.right.title}>{Store.sideBars.right.children}</SideBar>
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Settings path="/settings" />
          <About path="/about" />
          <Paste path="/p/:key" />
        </Router>
      </div>
    );
  }
}
