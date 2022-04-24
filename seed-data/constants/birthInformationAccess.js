const publicAccess = {
  _id: "626493c26c6235a56e7103d6",
  name: "Public",
};

const followersAccess = {
  _id: "626493cfa89a3ac721f300aa",
  name: "Your Followers",
};

const peopleYouFollow = {
  _id: "626493d5a045eed6a3d36285",
  name: "People You Follow",
};

const youFollowEachOtherAccess = {
  _id:"626493e436ba4fc6429b1166",
  name: "You Follow Each Other",
};

const onlyYouAccess = {
  _id: "626493ee3637607bd69983ab",
  name: "Only You",
};

const accessTypes = [
  publicAccess,
  followersAccess,
  peopleYouFollow,
  youFollowEachOtherAccess,
  onlyYouAccess,
];

exports.data = accessTypes;
exports.publicAccess = publicAccess;
exports.followersAccess = followersAccess;
exports.peopleYouFollow = peopleYouFollow;
exports.youFollowEachOtherAccess = youFollowEachOtherAccess;
exports.onlyYouAccess = onlyYouAccess;