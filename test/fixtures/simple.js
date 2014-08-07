var object = {
  downloadBin: function (req, res, next) {
    this.protectVisibility(req.session.user, req.bin, function(err, bin) {
      var filename = ['jsbin', bin.url, bin.revision, 'html'].join('.');

      var data = {
        domain: helpers.set('url host'),
        permalink: helpers.editUrlForBin(bin, true),
        user: undefsafe(bin, 'metadata.name') || false,
        year: (new Date()).getYear() + 1900
      };
    };
  }
};