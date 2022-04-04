const publicAccess = {
  name: "Public",
};

const followersAccess = {
  name: "Your Followers",
};

const peopleYouFollow = {
  name: "People You Follow",
};

const youFollowEachOtherAccess = {
  name: "You Follow Each Other",
};

const onlyYouAccess = {
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