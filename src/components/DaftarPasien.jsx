import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Data from '../dummy-data/Data';
import cekAngka from '../helpers/cekNumber';
import cekName from '../helpers/cekNameCapitalize';
import changeColor from '../helpers/changeStatusColor';
import { jumlahStatus, countRangeAge } from '../helpers/countData';

export default function DaftarPasien(props) {
  const defaultData = {
    nama: '',
    umur: '',
    kota: '',
    status: '',
  };

  const [form, setForm] = useState(defaultData);
  const [dataPasien, setDataPasien] = useState([]);
  const [isValidUmur, setIsValidUmur] = useState(true);
  const [isButtonActive, setButtonActive] = useState(false);
  const [sortMethod, setSortMethod] = useState({
    nama: '',
    umur: '',
  });
  const [loading, setloading] = useState(true);
  const [optionKota, setOptionKota] = useState([]);
  const [optionStatus, setOptionStatus] = useState([]);
  const [continents, setContinents] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (form.nama && form.kota && form.status) {
      setButtonActive(false);
    } else {
      setButtonActive(true);
    }
  }, [form]);

  // get API data
  async function getAPI(url) {
    const config = {
      url: url,
      method: 'GET',
    };

    const result = await axios(config)
      .then((res) => {
        if (res) {
          return res;
        }
      })
      .catch((error) => {
        return error;
      });

    return result;
  }

  useEffect(() => {
    async function getAllData() {
      try {
        const patientStatus = await getAPI('https://private-737d1c-sekolahfe.apiary-mock.com/patient-status-list');
        const cityList = await getAPI('https://private-737d1c-sekolahfe.apiary-mock.com/city-list');
        const patientList = await getAPI('https://private-737d1c-sekolahfe.apiary-mock.com/patient-list');
        const world = await getAPI('https://corona.lmao.ninja/v2/all');
        const continent = await getAPI('https://corona.lmao.ninja/v2/continents');
        const country = await getAPI('https://corona.lmao.ninja/v2/countries');

        setOptionStatus(patientStatus.data);
        setOptionKota(cityList.data);
        setDataPasien(patientList.data);
        setContinents(continent.data);
        setCountry(country.data);
        setSelectedItem(world.data);
      } catch (error) {
        console.log('Failed to call API');
      } finally {
        setloading(false);
      }
    }

    getAllData();
  }, []);

  const setFormData = (e, param) => {
    const { value } = e.target;

    if (param === 'umur') {
      setIsValidUmur(cekAngka(value));
    }

    setForm({
      ...form,
      [param]: value,
    });
  };

  const pushData = async () => {
    setDataPasien((prevState) => {
      return [...prevState, form];
    });

    setForm(() => defaultData);
  };

  const deleteData = (index) => {
    const newField = [...dataPasien];
    newField.splice(index, 1);

    setDataPasien(newField);
  };

  const ubahNama = (e) => {
    const text = cekName(e);

    setForm({
      ...form,
      nama: text,
    });
  };

  const sortingData = (param) => {
    let sortBy;
    if (sortMethod[param] === '' || sortMethod[param] === 'asc') {
      sortBy = 'desc';
    } else {
      sortBy = 'asc';
    }

    const sorting = dataPasien.sort((firstEl, secondEl) => {
      if (sortBy === 'desc') {
        let obj;
        if (param === 'nama') {
          obj = {
            nama: 'desc',
            umur: '',
          };
        } else {
          obj = {
            umur: 'desc',
            nama: '',
          };
        }

        setSortMethod({
          ...sortMethod,
          ...obj,
        });

        if (firstEl[param] < secondEl[param]) {
          return -1;
        } else {
          return 1;
        }
      } else {
        setSortMethod({
          ...sortMethod,
          [param]: 'asc',
        });

        if (secondEl[param] < firstEl[param]) {
          return -1;
        } else {
          return 1;
        }
      }
    });

    setDataPasien([...sorting]);
  };

  const selectContinent = (e) => {
    const id = e.target.value;
    const selected = continents.filter((val) => val.continent === id)[0];

    setSelectedItem(selected);
  };

  const selectCountry = (e) => {
    const id = e.target.value;
    const selected = country.filter((val) => val.countryInfo._id === Number(id))[0];

    setSelectedItem(selected);
  };

  function numberWithDot(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <>
      <div className='container'>
        <div className='columns is-multiline'>
          <div className='column is-full'>
            <div className='tabs is-centered is-boxed'>
              <ul>
                <li onClick={() => setTabIndex(0)} className={tabIndex === 0 ? 'is-active' : ''}>
                  <a>
                    <span>Input Data</span>
                  </a>
                </li>
                <li onClick={() => setTabIndex(1)} className={tabIndex === 1 ? 'is-active' : ''}>
                  <a>
                    <span>Statistik</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {tabIndex === 0 && (
            <div className='column is-full'>
              <div className='box form'>
                <div className='columns is-multiline'>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <input value={form.nama} onChange={(e) => setFormData(e, 'nama')} onBlur={(e) => ubahNama(e)} className='input is-primary' type='text' placeholder='Nama Pasien' id='nama' />
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <input value={form.umur} onChange={(e) => setFormData(e, 'umur')} className={isValidUmur ? 'input is-primary' : 'input is-danger'} type='text' placeholder='Umur' id='umur' />
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth is-medium'>
                    <div className='field'>
                      <div className='control'>
                        <div className={loading ? 'select is-fullwidth is-loading' : 'select is-primary is-fullwidth'}>
                          <select id='status' onChange={(e) => setFormData(e, 'kota')} defaultValue={'default'}>
                            <option value='default' disabled>
                              Kota
                            </option>
                            {optionKota.map((value, index) => (
                              <option key={`list-kota-${index}`} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth is-medium'>
                    <div className='field'>
                      <div className='control'>
                        <div className={loading ? 'select is-fullwidth is-loading' : 'select is-primary is-fullwidth'}>
                          <select id='status' onChange={(e) => setFormData(e, 'status')} defaultValue={'default'}>
                            <option value='default' disabled>
                              Status
                            </option>
                            {optionStatus.map((value, index) => (
                              <option key={`list-status-${index}`} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='column is-one-fifth'>
                    <div className='field'>
                      <div className='control'>
                        <button onClick={pushData} disabled={isButtonActive || !isValidUmur} className={isButtonActive || !isValidUmur ? 'button is-fullwidth' : 'button is-primary is-fullwidth'}>
                          Tambah Pasien
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='box'>
                <nav className='level is-gapless'>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading has-text-black'>Total Data</p>
                      <p className='title has-text-black'>{loading ? '...' : dataPasien.length}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading has-text-danger'>Positif</p>
                      <p className='title has-text-danger'>{loading ? '...' : jumlahStatus(dataPasien, 'Positif')}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading has-text-success'>Negatif</p>
                      <p className='title has-text-success'>{loading ? '...' : jumlahStatus(dataPasien, 'Negatif')}</p>
                    </div>
                  </div>
                  <div className='level-item has-text-centered'>
                    <div>
                      <p className='heading has-text-grey'>Belum Diketahui</p>
                      <p className='title has-text-grey'>{loading ? '...' : jumlahStatus(dataPasien, 'Belum Diketahui')}</p>
                    </div>
                  </div>
                </nav>

                <div className='columns is-gapless is-multiline stat'>
                  <div className='column is-3 has-text-centered'>
                    <span className='has-text-grey'>Umur 1 - 20: {loading ? '...' : countRangeAge(dataPasien, 1, 20)}</span>
                  </div>
                  <div className='column is-3 has-text-centered'>
                    <span className='has-text-grey'>Umur 21 - 40: {loading ? '...' : countRangeAge(dataPasien, 21, 40)}</span>
                  </div>
                  <div className='column is-3 has-text-centered'>
                    <span className='has-text-grey'>Umur 41 - 70: {loading ? '...' : countRangeAge(dataPasien, 41, 70)}</span>
                  </div>
                  <div className='column is-3 has-text-centered'>
                    <span className='has-text-grey'>Umur 70 - 100: {loading ? '...' : countRangeAge(dataPasien, 70)}</span>
                  </div>
                </div>

                <table className='table is-fullwidth is-hoverable'>
                  <thead>
                    <tr>
                      <th width='8%'>#</th>
                      <th width='25%'>
                        <span className='has-text-primary is-clickable' onClick={() => sortingData('nama')}>
                          Pasien
                          {sortMethod.nama === 'asc' && (
                            <span className='icon has-text-primary'>
                              <i className=' fas fa-sort-down'></i>
                            </span>
                          )}
                          {sortMethod.nama === 'desc' && (
                            <span className='icon has-text-primary'>
                              <i className=' fas fa-sort-up'></i>
                            </span>
                          )}
                        </span>
                      </th>
                      <th width='15%'>
                        <span className='has-text-primary is-clickable' onClick={() => sortingData('umur')}>
                          Umur
                          {sortMethod.umur === 'asc' && (
                            <span className='icon has-text-primary'>
                              <i className=' fas fa-sort-down'></i>
                            </span>
                          )}
                          {sortMethod.umur === 'desc' && (
                            <span className='icon has-text-primary'>
                              <i className=' fas fa-sort-up'></i>
                            </span>
                          )}
                        </span>
                      </th>
                      <th width='22%'>Kota</th>
                      <th width='20%'>Status</th>
                      <th width='10%'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan='6' className='has-text-centered'>
                          <span className='icon has-text-grey'>
                            <i className='fas fa-spinner fa-pulse'></i>
                          </span>
                        </td>
                      </tr>
                    ) : (
                      dataPasien.map((value, index) => (
                        <tr key={`list-nama-${index}`}>
                          <td>{index + 1}</td>
                          <td>{value.nama}</td>
                          <td>{value.umur}</td>
                          <td>{value.kota}</td>
                          <td className={changeColor(value.status)}>{value.status}</td>
                          <td>
                            <span className='delete is-medium' onClick={() => deleteData(index)}></span>
                          </td>
                        </tr>
                      ))
                    )}

                    {!loading && !dataPasien.length && (
                      <tr>
                        <td colSpan='6' className='has-text-centered'>
                          Tidak Ada Data!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tabIndex === 1 && (
            <div className='column is-full'>
              <div className='box'>
                <div className='box form'>
                  <div className='columns is-multiline'>
                    <div className='column is-3'>
                      <div className='field'>
                        <div className='control'>
                          <div className={loading ? 'select is-fullwidth is-loading' : 'select is-primary is-fullwidth'}>
                            <select id='status' onChange={(e) => selectContinent(e)} defaultValue={'default'}>
                              <option value='default' disabled>
                                Region
                              </option>
                              {continents.map((value, index) => (
                                <option key={`continents-${index}`} value={value.continent}>
                                  {value.continent}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='column is-3'>
                      <div className='field'>
                        <div className='control'>
                          <div className={loading ? 'select is-fullwidth is-loading' : 'select is-primary is-fullwidth'}>
                            <select id='status' onChange={(e) => selectCountry(e)} defaultValue={'default'}>
                              <option value='default' disabled>
                                Negara
                              </option>
                              {country.map((value, index) => (
                                <option key={`list-kota-${index}`} value={value.countryInfo._id}>
                                  {value.country}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className='columns is-multiline'>
                    <div className='column is-full has-text-centered'>
                      <span className='icon has-text-grey'>
                        <i className='fas fa-spinner fa-pulse'></i>
                      </span>
                    </div>
                  </div>
                ) : (
                  selectedItem && (
                    <div className='columns is-multiline'>
                      <div className='column is-full'>
                        <nav className='level is-gapless'>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-grey'>Jumlah Kasus</p>
                              <p className='title has-text-grey'>{numberWithDot(selectedItem.cases)}</p>
                            </div>
                          </div>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-danger'>Positif</p>
                              <p className='title has-text-danger'>{numberWithDot(selectedItem.active)}</p>
                            </div>
                          </div>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-warning'>Meninggal</p>
                              <p className='title has-text-warning'>{numberWithDot(selectedItem.deaths)}</p>
                            </div>
                          </div>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-success'>Sembuh</p>
                              <p className='title has-text-success'>{numberWithDot(selectedItem.deaths)}</p>
                            </div>
                          </div>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-grey'>Kasus Hari Ini</p>
                              <p className='title has-text-grey'>{numberWithDot(selectedItem.todayCases)}</p>
                            </div>
                          </div>
                          <div className='level-item has-text-centered'>
                            <div>
                              <p className='heading has-text-grey'>Meninggal Hari Ini</p>
                              <p className='title has-text-grey'>{numberWithDot(selectedItem.todayDeaths)}</p>
                            </div>
                          </div>
                        </nav>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// TUGAS
// 1. ubah status jadi dropdown
// 2. geser tombol submit sejajar dengan status
// 3. tambahkan kolom pada table yg isinya action 'delete'
// 4. pilih kota jadi dropdown khusus jakarta
// 5. validasi nama huruf besar di awal (capitalize)
// 6. sorting umur
// 7. ascending dan descending
