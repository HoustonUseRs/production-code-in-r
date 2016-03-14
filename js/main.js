function iframeLoaded(iframe) {
  iframe.height = "";
  iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
}

(function(window){

  document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
      initialize();
    }
  }

  function initialize(){
    var articleSelector = '.article-docs';
    var tocSelector = 'ul.nav.nav-pills.nav-stacked';

    setUpExternalLinks();
    setUpToc(articleSelector, tocSelector);
    setUpOnScroll(articleSelector, tocSelector);
    setUpHashListen(tocSelector);
  }

  function setUpOnScroll(articleSelector, tocSelector){
    var headings = document.querySelectorAll(articleSelector + ' h1');
    window.addEventListener('scroll', _.throttle(checkTopic, 100));

    function checkTopic(){
      var headingsInfo, top, activeLink;

      headingsInfo = _(headings)
        .map(function(heading){
          var headingRect = heading.getBoundingClientRect();
          var activeLink = _.kebabCase(heading.innerText);
          if(headingRect.top > 0){
            return null;
          }
          return {
            top: headingRect.top,
            hash: '#' + activeLink
          };
        })
        .compact()
        .value();

      if(_.isEmpty(headingsInfo)){
        return;
      }

      top = _.chain(headingsInfo)
        .map(function(headingInfo){
          return headingInfo.top;
        })
        .max().value();
      activeLink = _.find(headingsInfo, {top: top});

      if(activeLink.hash != location.hash){
        history.pushState(null, null, activeLink.hash);
        setActiveToHash(tocSelector);
      }
    }
  }

  function setUpHashListen(tocSelector){
    setActiveToHash();
    window.addEventListener('hashchange', _.partial(setActiveToHash, tocSelector));
  }

  function setActiveToHash(tocSelector){
    if(location.hash.length <= 1){
      return;
    }
    var activeItem = document.querySelector('a[href="' + location.hash + '"]');
    setActiveItem(activeItem.parentNode, tocSelector);
  }

  function setActiveItem(activeItem, tocSelector){
    var currentActive = document.querySelector('.active > ' + tocSelector + ' li.active');
    if(currentActive){
      currentActive.classList.remove('active');        
    }
    activeItem.classList.add('active');
  }

  function setUpToc(articleSelector, tocSelector){
    var tocLinkTemplate = (function(){
      var listItem = document.createElement('li');
      var link = document.createElement('a');
      listItem.appendChild(link);
      return listItem;
    }());

    var headings = document.querySelectorAll(articleSelector + ' h1');
    var tocHolder = document.querySelector('.active > ' + tocSelector);

    var toc = _.map(headings, function(heading){
      var linkInfo = makeHeadingNavigable(heading);
      var listItem = makeTocLink(linkInfo);
      tocHolder.appendChild(listItem);
    });

    function makeHeadingNavigable(heading){
      var aName = _.kebabCase(heading.innerText);
      heading.id = aName;

      return {name: aName, label: heading.innerText};
    }

    function makeTocLink(linkInfo){
      var base = tocLinkTemplate.cloneNode(true);

      base.childNodes[0].innerText = linkInfo.label;
      base.childNodes[0].href = '#' + linkInfo.name;
      return base;
    }
  }

  function setUpExternalLinks(){
    var links = document.querySelectorAll('a[href^="http"]');

    _.each(links, function(link){
      if(isLinkExternal(link.href)){
        openLinkInNewTab(link);
      }
    });

    function openLinkInNewTab(link){
      link.target = '_blank';
    }

    function isLinkExternal(url){
      var domainRe = /https?:\/\/((?:[\w\d\-]+\.)+[\w\d\-]{2,})/i;

      function domain(url) {
        var domainSplit = domainRe.exec(url);
        if(domainSplit){
          domainSplit = domainSplit[1];
        }
        return domainSplit;
      }
      return domain(location.href) !== domain(url);
    }
  }


}(window))