/**
  The grid will operate as row / column
  So grid[2][1] will be row 2, column 1
*/
let spaces = [];
spaces.push([   //row 0
  { col: 7, borders: { top: true, left: true, right: true} },
  { col: 16, borders: { top: true, left: true, right: true} }
]);
spaces.push([   //row 1
  { col: 7, borders: { left: true } },
  { col: 8, borders: { top: true, right: true } },
  { col: 15, borders: { top: true, left: true } },
  { col: 16, borders: { right: true } }
]);
spaces.push([   //row 2
  { col: 7, borders: { left: true } },
  { col: 8, borders: { right: true } },
  { col: 15, borders: { left: true } },
  { col: 16, borders: { right: true } }
]);
spaces.push([   //row 3
  { col: 7, borders: { left: true } },
  { col: 8, borders: { right: true } },
  { col: 15, borders: { left: true } },
  { col: 16, borders: { right: true } }
]);
spaces.push([  //row 4
  { col: 1, borders: { top: true, left: true } },
  { col: 2, borders: { top: true } },
  { col: 3, borders: { top: true } },
  { col: 4, borders: { top: true } },
  { col: 5, borders: { top: true } },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: { left: true } },
  { col: 16, borders: { right: true } }
]);
spaces.push([   //row 5
  { col: 0, borders: { top: true, left: true, bottom: true } },
  { col: 1, borders: { bottom: true } },
  { col: 2, borders: { bottom: true } },
  { col: 3, borders: { bottom: true } },
  { col: 4, borders: { bottom: true } },
  { col: 5, borders: { bottom: true } },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 15, borders: { left: true } },
  { col: 16, borders: { right: true } }
]);
spaces.push([   //row 6
  { col: 6, borders: { left: true, bottom: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 15, borders: { left: true } },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: { top: true } },
  { col: 19, borders: { top: true } },
  { col: 20, borders: { top: true } },
  { col: 21, borders: { top: true } },
  { col: 22, borders: { top: true, right: true } }
]);
spaces.push([   //row 7
  { col: 7, borders: { left: true } },
  { col: 8, borders: {} },
  { col: 9, borders: { top: true, bottom: true } },
  { col: 10, borders: { top: true, bottom: true } },
  { col: 11, borders: { bottom: true } },
  { col: 12, borders: { bottom: true } },
  { col: 13, borders: { top: true, bottom: true } },
  { col: 14, borders: { top: true } },
  { col: 15, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: {} },
  { col: 20, borders: {} },
  { col: 21, borders: {} },
  { col: 22, borders: {} },
  { col: 23, borders: { top: true, right: true, bottom: true } }
]);
spaces.push([   //row 8
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} },
  { col: 16, borders: { bottom: true } },
  { col: 17, borders: {} },
  { col: 18, borders: { bottom: true } },
  { col: 19, borders: { bottom: true } },
  { col: 20, borders: { bottom: true } },
  { col: 21, borders: { bottom: true } },
  { col: 22, borders: { right: true, bottom: true } }
]);
spaces.push([   //row 9
  { col: 7, borders: { left: true } },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: { right: true } }
]);
spaces.push([   //row 10
  { col: 6, borders: { top: true, left: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: { right: true } }
]);
spaces.push([   //row 11
  { col: 1, borders: { top: true, left: true } },
  { col: 2, borders: { top: true, bottom: true } },
  { col: 3, borders: { bottom: true } },
  { col: 4, borders: { top: true, bottom: true } },
  { col: 5, borders: { top: true, bottom: true } },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: { right: true } }
]);
spaces.push([   //row 12
  { col: 6, borders: { left: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} },
]);
spaces.push([   //row 13
  { col: 6, borders: { left: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: { right: true } }
]);
spaces.push([   //row 14
  { col: 6, borders: { left: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: { right: true } }
]);
spaces.push([   //row 15
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 9, borders: { top: true } },
  { col: 10, borders: { top: true } },
  { col: 11, borders: { top: true } },
  { col: 12, borders: { top: true } },
  { col: 13, borders: { top: true } },
  { col: 14, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: { top: true } },
  { col: 17, borders: { top: true } },
  { col: 18, borders: { top: true, right: true } }
]);
spaces.push([   //row 16
  { col: 6, borders: { left: true } },
  { col: 7, borders: {} },
  { col: 8, borders: { bottom: true } },
  { col: 9, borders: {} },
  { col: 10, borders: { bottom: true } },
  { col: 11, borders: { bottom: true } },
  { col: 12, borders: { bottom: true } },
  { col: 13, borders: { bottom: true } },
  { col: 14, borders: {} },
  { col: 15, borders: { bottom: true } },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: { top: true } },
  { col: 20, borders: { top: true } },
  { col: 21, borders: { top: true } },
  { col: 22, borders: { top: true, right: true } }
]);
spaces.push([   //row 17
  { col: 1, borders: { top: true, left: true } },
  { col: 2, borders: { top: true } },
  { col: 3, borders: { top: true } },
  { col: 4, borders: { top: true } },
  { col: 5, borders: { top: true } },
  { col: 6, borders: {} },
  { col: 7, borders: { right: true } },
  { col: 16, borders: { left: true } },
  { col: 17, borders: {} },
  { col: 18, borders: { bottom: true } },
  { col: 19, borders: {} },
  { col: 20, borders: { bottom: true } },
  { col: 21, borders: { bottom: true } },
  { col: 22, borders: { bottom: true } },
  { col: 23, borders: { top: true, right: true, bottom: true } }
]);
spaces.push([   //row 18
  { col: 0, borders: { top: true, left: true, bottom: true } },
  { col: 1, borders: { bottom: true } },
  { col: 2, borders: { bottom: true } },
  { col: 3, borders: { bottom: true } },
  { col: 4, borders: { bottom: true } },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: { right: true } },
  { col: 16, borders: { left: true } },
  { col: 17, borders: { right: true } }
]);
spaces.push([   //row 19
  { col: 5, borders: { bottom: true } },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: { right: true } }
]);
spaces.push([   //row 20
  { col: 6, borders: { left: true } },
  { col: 7, borders: { right: true } },
  { col: 16, borders: { left: true } },
  { col: 17, borders: { right: true } }
]);
spaces.push([   //row 21
  { col: 6, borders: { left: true } },
  { col: 7, borders: { right: true } },
  { col: 16, borders: { left: true } },
  { col: 17, borders: { right: true } }
]);
spaces.push([   //row 22
  { col: 6, borders: { left: true, bottom: true } },
  { col: 7, borders: { right: true } },
  { col: 16, borders: { left: true } },
  { col: 17, borders: { right: true, bottom: true } }
]);
spaces.push([   //row 23
  { col: 7, borders: { left: true, bottom: true } },
  { col: 8, borders: { top: true, bottom: true } },
  { col: 9, borders: { top: true, right: true } },
  { col: 14, borders: { top: true, left: true } },
  { col: 15, borders: { top: true, bottom: true } },
  { col: 16, borders: { right: true, bottom: true } }
]);
spaces.push([   //row 24
  { col: 9, borders: { left: true, right: true, bottom: true } },
  { col: 14, borders: { left: true, right: true, bottom: true } }
]);

export default spaces;
