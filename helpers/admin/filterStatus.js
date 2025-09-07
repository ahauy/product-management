module.exports = (query) => {
  const filterStatus = [
    {
      name: 'All',
      status: '',
      active: ''
    },
    {
      name: 'Active',
      status: 'active',
      active: ''
    },
    {
      name: 'Inactive',
      status: 'inactive',
      active: ''
    }
  ]

  if(query.status) {
    let index = filterStatus.findIndex(item => item.status == query.status)
    filterStatus[index].active = 'active';
  } else {
    let index = filterStatus.findIndex(item => item.status == '')
    filterStatus[index].active = 'active';
  }

  return filterStatus;
}