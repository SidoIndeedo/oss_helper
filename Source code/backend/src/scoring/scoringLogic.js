const express = require("express");
/**
 Labels,
 Created at/Updated at,
 Last Activity,
 Stars,
 Freshness score,
Comment density score,
Activity score,
Label signal,
Stack match score,
AI confidence,
Preferred language,
Secondary language,
Experience level,
 */

const heuristics = (issues, userInfo) => {
  //github issue
  const issue = issue;
  //user info
  const { techStack, experience } = userInfo;

  const result = issues.map((doc) => {
    let rank = 0;

    if (doc.label === "good first issue" || doc.label === "documentation")
      rank += 5;
    else {
      rank -= 1;
    }

    if (doc.commentLength < 150 && doc.commentLength > 20) rank += 3;
    else rank -= 2;

    if (doc.lastActivity < "5months") rank += 5;
    else rank -= 2;
  });
};
