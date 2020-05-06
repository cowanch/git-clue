/**
  The grid will operate as row / column
  So grid[2][1] will be row 2, column 1
*/
let spaces = [];
spaces.push([   //row 0
  { col: 7, borders: { top: true, left: true, right: true } },
  { col: 16, borders: { top: true, left: true, right: true } }
]);
spaces.push([   //row 1
  { col: 7, borders: {} },
  { col: 8, borders: { top: true } },
  { col: 15, borders: { top: true } },
  { col: 16, borders: {} }
]);
spaces.push([   //row 2
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} }
]);
spaces.push([   //row 3
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} }
]);
spaces.push([  //row 4
  { col: 1, borders: { left: true } },
  { col: 2, borders: {} },
  { col: 3, borders: {} },
  { col: 4, borders: {} },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} }
]);
spaces.push([   //row 5
  { col: 0, borders: { top: true, left: true, bottom: true } },
  { col: 1, borders: {} },
  { col: 2, borders: {} },
  { col: 3, borders: {} },
  { col: 4, borders: {} },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} }
]);
spaces.push([   //row 6
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: {} },
  { col: 20, borders: {} },
  { col: 21, borders: {} },
  { col: 22, borders: { right: true } }
]);
spaces.push([   //row 7
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 9, borders: { bottom: true } },
  { col: 10, borders: { bottom: true } },
  { col: 11, borders: { bottom: true } },
  { col: 12, borders: { bottom: true } },
  { col: 13, borders: { bottom: true } },
  { col: 14, borders: {} },
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
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: {} },
  { col: 20, borders: {} },
  { col: 21, borders: {} },
  { col: 22, borders: { right: true } }
]);
spaces.push([   //row 9
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} }
]);
spaces.push([   //row 10
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} }
]);
spaces.push([   //row 11
  { col: 1, borders: { left: true } },
  { col: 2, borders: {} },
  { col: 3, borders: {} },
  { col: 4, borders: {} },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} }
]);
spaces.push([   //row 12
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} },
]);
spaces.push([   //row 13
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} }
]);
spaces.push([   //row 14
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: { right: true } },
  { col: 14, borders: { left: true } },
  { col: 15, borders: {} }
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
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} }
]);
spaces.push([   //row 16
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 8, borders: {} },
  { col: 9, borders: {} },
  { col: 10, borders: {} },
  { col: 11, borders: {} },
  { col: 12, borders: {} },
  { col: 13, borders: {} },
  { col: 14, borders: {} },
  { col: 15, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: {} },
  { col: 20, borders: {} },
  { col: 21, borders: {} },
  { col: 22, borders: { right: true } }
]);
spaces.push([   //row 17
  { col: 1, borders: { left: true } },
  { col: 2, borders: {} },
  { col: 3, borders: {} },
  { col: 4, borders: {} },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} },
  { col: 18, borders: {} },
  { col: 19, borders: {} },
  { col: 20, borders: {} },
  { col: 21, borders: {} },
  { col: 22, borders: {} },
  { col: 23, borders: { top: true, right: true, bottom: true } }
]);
spaces.push([   //row 18
  { col: 0, borders: { top: true, left: true, bottom: true } },
  { col: 1, borders: {} },
  { col: 2, borders: {} },
  { col: 3, borders: {} },
  { col: 4, borders: {} },
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} }
]);
spaces.push([   //row 19
  { col: 5, borders: {} },
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} }
]);
spaces.push([   //row 20
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} }
]);
spaces.push([   //row 21
  { col: 6, borders: {} },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: {} }
]);
spaces.push([   //row 22
  { col: 6, borders: { bottom: true } },
  { col: 7, borders: {} },
  { col: 16, borders: {} },
  { col: 17, borders: { bottom: true } }
]);
spaces.push([   //row 23
  { col: 7, borders: { left: true, bottom: true } },
  { col: 8, borders: { bottom: true } },
  { col: 9, borders: {} },
  { col: 14, borders: {} },
  { col: 15, borders: { bottom: true } },
  { col: 16, borders: { right: true, bottom: true } }
]);
spaces.push([   //row 24
  { col: 9, borders: { left: true, right: true, bottom: true } },
  { col: 14, borders: { left: true, right: true, bottom: true } }
]);

export default spaces;
