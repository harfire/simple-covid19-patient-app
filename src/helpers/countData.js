export function jumlahStatus(data, status) {
  if (data) {
    const jumlah = data.filter((val) => val.status === status);

    return jumlah.length;
  }

  return 0;
}

export const countRangeAge = (data, start, end = 100) => {
  return data.filter((val) => val.umur >= start && val.umur <= end).length;
};
