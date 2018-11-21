import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

class Layout extends Component{

  static async componentDidMount(){
  }

  render(){
    return (
      <Container>
        <Head>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
        </Head>
        <Header/>
        {this.props.children}
      </Container>
    );
  }
}

export default Layout;
