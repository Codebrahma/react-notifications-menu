# react-notifications-menu

> A React Component used to render notifications with default styles and also allows to customize entire notification component
> by providing necessary props and styles.

[![NPM](https://img.shields.io/npm/v/react-notifications-menu.svg)](https://www.npmjs.com/package/react-notifications-menu) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
<img  src="https://github.com/Codebrahma/react-notifications-menu/blob/master/src/assets/demo.gif" height="320px"/>
</p>

## Getting Started

### Install

Install using npm or yarn

```bash
npm install --save react-notifications-menu
```

or

```bash
yarn add --save react-notifications-menu
```

## Basic Usage

```jsx
import Notifications from "react-notifications-menu";

const Example = () => {
  return (
    <Notifications
      renderItem={CustomComponent}
      classNamePrefix='okrjoy'
      headerBackgroundColor='red'
    />
  );
};
```

To know more, visit [react-notifications-menu](https://react-notifications-menu.netlify.com/) docs

## Demo

To view the demo of the Notification component in the code sandbox. Click <a style="color:#cc3a38" href="https://codesandbox.io/s/strange-forest-1kwtb?file=/src/App.js">here</a>.
