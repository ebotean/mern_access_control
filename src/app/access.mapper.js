const { AccessStatus } = require("@prisma/client");
const moment = require('moment');

const mapAccess = (access) => {
  const createdAt = moment(access.createdAt.$date).format('DD/MM/YYYY HH:mm:ss')
  const updatedAt = access.updatedAt ? moment(access.updatedAt.$date).format('DD/MM/YYYY HH:mm:ss') : '-'
  return {
    id: access._id.$oid,
    createdAt: createdAt,
    updatedAt: updatedAt,
    status: access.status,
    message: access.message,
    user: {
      id: access.user._id.$oid,
      name: access.user.name,
      email: access.user.email,
    },
  };
}

const mapper = (items) => {
  return {
    map: () => items.map(mapAccess),
    mapToResponse: () => items.reduce((obj, access) => {
      const entity = mapAccess(access);
      (access.status === AccessStatus.ERROR || access.status === AccessStatus.FAILURE)
        ? obj.accesses.error.push(entity)
        : obj.accesses.ok.push(entity);

      return obj;
    }, { accesses: { ok: [], error: [] } })
  };

}

module.exports = mapper;