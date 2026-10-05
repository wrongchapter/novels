/*
 * hexo theme meow
 * post data helper
 */

"use strict";

hexo.extend.helper.register('getArchiveList', function () {
  const { posts } = this.page;
  let archiveList = [], years = [];

  posts.forEach((post) => {
    if (!years.includes(post.date.year())) {
      years.push(post.date.year())
    }
  });
  years.forEach((year) => {
    archiveList.push({ year: year, yearList: [], yearNum: 0 });
  });

  posts.forEach((post) => {
    let year = post.date.year(), month = post.date.month();
    archiveList.forEach((yearItem) => {
      if (year != yearItem.year) {
        return;
      }
      yearItem.yearNum += 1;

      let monthFlag = false;
      for (let m = 0; m < yearItem.yearList.length; m++) {
        if (month != yearItem.yearList[m].month) {
          continue;
        }
        yearItem.yearList[m].postList.push(post);
        monthFlag = true;
        break;
      }

      if (!monthFlag) {
        yearItem.yearList.push({ month: month, postList: [post] });
      }
    });
  });

  return archiveList;
});

hexo.extend.helper.register('getCategoryList', function () {
  const { categories } = this.site;
  const { theme } = this;
  if (!categories || categories.length == 0) return [];
  const depth = theme.category.depth ? parseInt(String(theme.category.depth), 10) : 0;
  if (depth > 3) depth = 3;
  let result = [];

  const prepareQuery = parent => {
    const query = {};
    if (parent) {
      query.parent = parent;
    } else {
      query.parent = { $exists: false };
    }
    return categories.find(query).sort('name', 1);
  };

  const getChildList = (level, parent) => {
    let child = [];
    prepareQuery(parent).forEach((childCat) => {
      let catInfo = {
        name: childCat.name,
        path: childCat.path,
        count: childCat.length,
        _id: childCat._id,
        child: []
      };
      if (!depth || level + 1 < depth) {
        let childList = getChildList(level + 1, childCat._id);
        if (childList) {
          catInfo.child.push(...childList);
        }
      }
      child.push(catInfo);
    });
    return child;
  };

  const getHierarchicalList = (level) => {
    prepareQuery("").forEach((cat) => {
      let catInfo = {
        name: cat.name,
        path: cat.path,
        count: cat.length,
        _id: cat._id,
        child: []
      };
      if (!depth || level + 1 < depth) {
        let childList = getChildList(level + 1, cat._id);
        if (childList) {
          catInfo.child.push(...childList);
        }
      }
      result.push(catInfo);
    });
  };

  getHierarchicalList(0);
  return result;
});

// Chapter navigation for series posts
hexo.extend.helper.register('getChapterNav', function (page) {
  if (!page.series || page.chapter === undefined || page.chapter === null) {
    return null;
  }

  const currentChapter = Number(page.chapter);

  if (Number.isNaN(currentChapter)) {
    return null;
  }

  const chapters = this.site.posts
    .filter(post => post.series === page.series && post.chapter !== undefined && post.chapter !== null)
    .toArray()
    .sort((a, b) => Number(a.chapter) - Number(b.chapter));

  const currentIndex = chapters.findIndex(post => post.path === page.path);

  if (currentIndex === -1) {
    return null;
  }

  return {
    prev: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  };
});
