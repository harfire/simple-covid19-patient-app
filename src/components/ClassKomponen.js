import React, { Component } from 'react';

class ClassKomponen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ['Andi', 'Sepak Bola', 'Bandung', 'Sekolah FE'],
      alamat: 'Dago', // Cihampelas
      kota: props.lokasi
    };
  }

  // state = {
  //   abc: 'def',
  //   loading: true,
  //   alamat: 'Bandung'
  // };

  ubahStateFn(param) {
    // this.setState({
    //   alamat: 'Cihampelas'
    // });

    this.setState((prevState, props) => {
      return {
        alamat: 'Cihampelas'
      };
    });
  }

  render() {
    return (
      <>
        <div>------------------------------------------------</div>
        <div className='title'>Class Component</div>
        <div>{this.props.lokasi}</div>
        <button onClick={() => this.ubahStateFn('abc')}>Ubah Kota</button>
        <div>------------------------------------------------</div>
      </>
    );
  }
}

export default ClassKomponen;
