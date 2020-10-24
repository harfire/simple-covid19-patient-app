export default function changeStatusColor(value = 'Belum Diketahui') {
  const convert = value.toLocaleLowerCase().split(' ').join('_');
  const status = {
    positif: 'has-text-danger',
    negatif: 'has-text-success',
    belum_diketahui: 'has-text-grey'
  };

  return status[convert];
}
