const mapper = (items) => {
  return {
    map: () => items.map(access => {
      return {
        id: access._id.$oid,
        createdAt: access.createdAt.$date,
        updatedAt: access.updatedAt?.$date,
        status: access.status,
        message: access.message,
        user: {
          id: access.user._id.$oid,
          name: access.user.name,
          email: access.user.email,
        },
      };
    })
  };
}

module.exports = mapper;