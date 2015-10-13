'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _browserCookieLite = require('browser-cookie-lite');

var _styleUtils = require('./styleUtils');

var _styleUtils2 = _interopRequireDefault(_styleUtils);

var CookieBanner = _react2['default'].createClass({
  displayName: 'CookieBanner',

  /*eslint-disable */
  propTypes: {
    message: _react2['default'].PropTypes.string,
    onAccept: _react2['default'].PropTypes.func,
    link: _react2['default'].PropTypes.shape({
      msg: _react2['default'].PropTypes.string,
      url: _react2['default'].PropTypes.string.isRequired
    }),
    buttonMessage: _react2['default'].PropTypes.string,
    cookie: _react2['default'].PropTypes.string,
    dismissOnScroll: _react2['default'].PropTypes.bool,
    dismissOnScrollThreshold: _react2['default'].PropTypes.number,
    closeIcon: _react2['default'].PropTypes.string,
    disableStyle: _react2['default'].PropTypes.bool,
    styles: _react2['default'].PropTypes.object,
    children: _react2['default'].PropTypes.element
  },
  /*eslint-enable */

  getDefaultProps: function getDefaultProps() {
    return {
      onAccept: function onAccept() {},
      dismissOnScroll: true,
      cookie: 'accepts-cookies',
      buttonMessage: 'Got it',
      className: '',
      dismissOnScrollThreshold: 0
    };
  },

  getInitialState: function getInitialState() {
    return {
      listeningScroll: this.props.dismissOnScroll
    };
  },

  componentDidMount: function componentDidMount() {
    if (!this.acceptsCookies() && this.props.dismissOnScroll) {
      window.onscroll = this.onScroll;
    }
  },

  onScroll: function onScroll() {
    // tacit agreement buahaha! (evil laugh)
    if (window.pageYOffset > this.props.dismissOnScrollThreshold) {
      this.onAccept();
    }
  },

  onAccept: function onAccept() {
    _browserCookieLite.cookie(this.props.cookie, true);
    this.props.onAccept({ cookie: this.props.cookie });
    if (this.props.dismissOnScroll) {
      window.onscroll = null;
      this.setState({ listeningScroll: false });
    }
  },

  getStyle: function getStyle(style) {
    if (!this.props.disableStyle) {
      var styles = _styleUtils2['default'].getStyle(style);
      if (this.props.styles && this.props.styles[style]) {
        // apply custom styles
        Object.assign(styles, this.props.styles[style]);
      }
      return styles;
    }
  },

  getCloseButton: function getCloseButton() {
    if (this.props.closeIcon) {
      return _react2['default'].createElement('i', { className: this.props.closeIcon, onClick: this.onAccept, style: this.getStyle('icon') });
    }
    return _react2['default'].createElement(
      'div',
      { className: 'button-close', onClick: this.onAccept, style: this.getStyle('button') },
      this.props.buttonMessage
    );
  },

  getLink: function getLink() {
    if (this.props.link) {
      return _react2['default'].createElement(
        'a',
        {
          href: this.props.link.url,
          className: 'cookie-link',
          style: this.getStyle('link') },
        this.props.link.msg || 'Learn more'
      );
    }
  },

  getBanner: function getBanner() {
    if (this.props.children) {
      return this.props.children;
    }
    return _react2['default'].createElement(
      'div',
      { className: this.props.className + ' react-cookie-banner', style: this.getStyle('banner') },
      _react2['default'].createElement(
        'span',
        { className: 'cookie-message', style: this.getStyle('message') },
        this.props.message,
        this.getLink()
      ),
      this.getCloseButton()
    );
  },

  acceptsCookies: function acceptsCookies() {
    return typeof window !== 'undefined' && _browserCookieLite.cookie(this.props.cookie);
  },

  render: function render() {
    return this.acceptsCookies() ? null : this.getBanner();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!this.acceptsCookies() && nextProps.dismissOnScroll && !this.state.listeningScroll) {
      window.onscroll = this.onScroll;
      this.setState({ listeningScroll: true });
    }
  }

});

exports['default'] = CookieBanner;
module.exports = exports['default'];