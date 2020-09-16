<!--
  Rooms are rendered slightly offset from the board grid. They extend past the edges of the grid by a certain scale of a cell.
  For this reason, the coordinates of the lines that render the room are offset slightly to make it easier to calculate and draw.
  This component will draw all bordering lines for a room with the exception of the space that has the door on the board.
-->
<template>
  <g>
    <!-- Study -->
    <g :transform="getXYTranslation(-offsetScale, -offsetScale)">
      <polygon :points="`0,0 ${offset(6)},0 ${offset(6)},${offset(1)} ${offset(7)},${offset(1)} ${offset(7)},${offset(4)} 0,${offset(4)}`"
               :class="{ highlight: availableMoves.study }"/>
      <line class="door" :x1="offset(6)" :x2="offset(7)" :y1="offset(4)" :y2="offset(4)"/>
      <line :x1="-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="0" :y2="offset(1)"/>
      <line :x1="offset(6)-borderWidth/2" :x2="offset(7)+borderWidth/2" :y1="offset(1)" :y2="offset(1)"/>
      <line :x1="offset(7)" :x2="offset(7)" :y1="offset(1)" :y2="offset(4)"/>
      <line :x1="-borderWidth/2" :x2="offset(6)" :y1="offset(4)" :y2="offset(4)"/>
      <line :x1="0" :x2="0" :y1="0" :y2="offset(4)"/>
      <text :x="offset(3)" :y="cell(2)">Study</text>
    </g>
    <!-- Library -->
    <g :transform="getXYTranslation(-offsetScale, 6)">
      <polygon :points="`${offset(1)},0 ${offset(6)},0 ${offset(6)},${cell(1)} ${offset(7)},${cell(1)} ${offset(7)},${cell(4)}
                        ${offset(6)},${cell(4)} ${offset(6)},${cell(5)} ${offset(1)},${cell(5)} ${offset(1)},${cell(4)} 0,${cell(4)}
                        0,${cell(1)} ${offset(1)},${cell(1)}`"
               :class="{ highlight: availableMoves.library }"/>
      <line class="door" :x1="offset(7)" :x2="offset(7)" :y1="cell(2)" :y2="cell(3)"/>
      <line class="door" :x1="offset(3)" :x2="offset(4)" :y1="cell(5)" :y2="cell(5)"/>
      <line :x1="offset(1)-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="0" :y2="cell(1)"/>
      <line :x1="offset(6)-borderWidth/2" :x2="offset(7)+borderWidth/2" :y1="cell(1)" :y2="cell(1)"/>
      <line :x1="offset(7)" :x2="offset(7)" :y1="cell(1)" :y2="cell(2)"/>
      <line :x1="offset(7)" :x2="offset(7)" :y1="cell(3)" :y2="cell(4)"/>
      <line :x1="offset(6)-borderWidth/2" :x2="offset(7)+borderWidth/2" :y1="cell(4)" :y2="cell(4)"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="cell(4)" :y2="cell(5)"/>
      <line :x1="offset(4)" :x2="offset(6)+borderWidth/2" :y1="cell(5)" :y2="cell(5)"/>
      <line :x1="offset(1)-borderWidth/2" :x2="offset(3)" :y1="cell(5)" :y2="cell(5)"/>
      <line :x1="offset(1)" :x2="offset(1)" :y1="cell(4)" :y2="cell(5)"/>
      <line :x1="-borderWidth/2" :x2="offset(1)+borderWidth/2" :y1="cell(4)" :y2="cell(4)"/>
      <line :x1="0" :x2="0" :y1="cell(4)" :y2="cell(1)"/>
      <line :x1="-borderWidth/2" :x2="offset(1)+borderWidth/2" :y1="cell(1)" :y2="cell(1)"/>
      <line :x1="offset(1)" :x2="offset(1)" :y1="cell(1)" :y2="0"/>
      <text :x="cell(3.5)" :y="cell(2.5)">Library</text>
    </g>
    <!-- Billiard Room -->
    <g :transform="getXYTranslation(-offsetScale, 12)">
      <polygon :points="`0,0 ${offset(6)},0 ${offset(6)},${cell(5)} 0,${cell(5)}`"
               :class="{ highlight: availableMoves.billiard }"/>
      <line class="door" :x1="offset(1)" :x2="offset(2)" :y1="0" :y2="0"/>
      <line class="door" :x1="offset(6)" :x2="offset(6)" :y1="cell(3)" :y2="cell(4)"/>
      <line :x1="-borderWidth/2" :x2="offset(1)" :y1="0" :y2="0"/>
      <line :x1="offset(2)" :x2="offset(6)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="0" :y2="cell(3)"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="cell(4)" :y2="cell(5)"/>
      <line :x1="-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="cell(5)" :y2="cell(5)"/>
      <line :x1="0" :x2="0" :y1="0" :y2="cell(5)"/>
      <text :x="offset(2)" :y="cell(2)">Billiard Room</text>
    </g>
    <!-- Conservatory -->
    <g :transform="getXYTranslation(-offsetScale, 19)">
      <polygon :points="`${offset(1)},0 ${offset(5)},0 ${offset(5)},${cell(1)} ${offset(6)},${cell(1)} ${offset(6)},${offset(5)}
                        0,${offset(5)} 0,${cell(1)} ${offset(1)},${cell(1)}`"
               :class="{ highlight: availableMoves.conservatory }"/>
      <line class="door" :x1="offset(5)" :x2="offset(5)" :y1="0" :y2="cell(1)"/>
      <line :x1="offset(1)-borderWidth/2" :x2="offset(5)" :y1="0" :y2="0"/>
      <line :x1="offset(5)" :x2="offset(6)+borderWidth/2" :y1="cell(1)" :y2="cell(1)"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="cell(1)" :y2="offset(5)"/>
      <line :x1="-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="offset(5)" :y2="offset(5)"/>
      <line :x1="0" :x2="0" :y1="cell(1)" :y2="offset(5)"/>
      <line :x1="-borderWidth/2" :x2="offset(1)+borderWidth/2" :y1="cell(1)" :y2="cell(1)"/>
      <line :x1="offset(1)" :x2="offset(1)" :y1="0" :y2="cell(1)"/>
      <text :x="cell(3)" :y="cell(3)">Conservatory</text>
    </g>
    <!-- Ballroom -->
    <g :transform="getXYTranslation(8, 17)">
      <polygon :points="`0,0 ${cell(8)},0 ${cell(8)},${cell(6)} ${cell(6)},${cell(6)} ${cell(6)},${offset(7)} ${cell(2)},${offset(7)}
                        ${cell(2)},${cell(6)} 0,${cell(6)}`"
               :class="{ highlight: availableMoves.ballroom }"/>
      <line class="door" :x1="0" :x2="0" :y1="cell(2)" :y2="cell(3)"/>
      <line class="door" :x1="cell(1)" :x2="cell(2)" :y1="0" :y2="0"/>
      <line class="door" :x1="cell(6)" :x2="cell(7)" :y1="0" :y2="0"/>
      <line class="door" :x1="cell(8)" :x2="cell(8)" :y1="cell(2)" :y2="cell(3)"/>
      <line :x1="-borderWidth/2" :x2="cell(1)" :y1="0" :y2="0"/>
      <line :x1="cell(2)" :x2="cell(6)" :y1="0" :y2="0"/>
      <line :x1="cell(7)" :x2="cell(8)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="cell(8)" :x2="cell(8)" :y1="0" :y2="cell(2)"/>
      <line :x1="cell(8)" :x2="cell(8)" :y1="cell(3)" :y2="cell(6)"/>
      <line :x1="cell(6)-borderWidth/2" :x2="cell(8)+borderWidth/2" :y1="cell(6)" :y2="cell(6)"/>
      <line :x1="cell(6)" :x2="cell(6)" :y1="cell(6)" :y2="offset(7)+borderWidth/2"/>
      <path :d="`M ${cell(2)} ${offset(7)} q ${cell(2)} ${cell(1)} ${cell(4)} 0`"
            :class="{ highlight: availableMoves.ballroom }"/>
      <line :x1="cell(2)" :x2="cell(2)" :y1="cell(6)" :y2="offset(7)+borderWidth/2"/>
      <line :x1="-borderWidth/2" :x2="cell(2)+borderWidth/2" :y1="cell(6)" :y2="cell(6)"/>
      <line :x1="0" :x2="0" :y1="cell(3)" :y2="cell(6)"/>
      <line :x1="0" :x2="0" :y1="0" :y2="cell(2)"/>
      <text :x="cell(4)" :y="cell(2.5)">Ballroom</text>
    </g>
    <!-- Kitchen -->
    <g :transform="getXYTranslation(18, 18)">
      <polygon :points="`0,0 ${cell(5)},0 ${cell(5)},${cell(1)} ${offset(6)},${cell(1)} ${offset(6)},${offset(6)} 0,${offset(6)}`"
               :class="{ highlight: availableMoves.kitchen }"/>
      <line class="door" :x1="cell(1)" :x2="cell(2)" :y1="0" :y2="0"/>
      <line :x1="-borderWidth/2" :x2="cell(1)" :y1="0" :y2="0"/>
      <line :x1="cell(2)" :x2="cell(5)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="cell(5)" :x2="cell(5)" :y1="0" :y2="cell(1)"/>
      <line :x1="cell(5)-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="cell(1)" :y2="cell(1)"/>
      <line :x1="offset(6)" :x2="offset(6)" :y1="cell(1)" :y2="offset(6)"/>
      <line :x1="-borderWidth/2" :x2="offset(6)+borderWidth/2" :y1="offset(6)" :y2="offset(6)"/>
      <line :x1="0" :x2="0" :y1="0" :y2="offset(6)"/>
      <text :x="cell(3)" :y="cell(3)">Kitchen</text>
    </g>
    <!-- Dining Room -->
    <g :transform="getXYTranslation(16, 9)">
      <polygon :points="`0,0 ${offset(8)},0 ${offset(8)},${cell(7)} ${cell(3)},${cell(7)} ${cell(3)},${cell(6)} 0,${cell(6)}`"
               :class="{ highlight: availableMoves.dining }"/>
      <line class="door" :x1="cell(1)" :x2="cell(2)" :y1="0" :y2="0"/>
      <line class="door" :x1="0" :x2="0" :y1="cell(3)" :y2="cell(4)"/>
      <line :x1="-borderWidth/2" :x2="cell(1)" :y1="0" :y2="0"/>
      <line :x1="cell(2)" :x2="offset(8)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="offset(8)" :x2="offset(8)" :y1="0" :y2="cell(7)"/>
      <line :x1="cell(3)-borderWidth/2" :x2="offset(8)+borderWidth/2" :y1="cell(7)" :y2="cell(7)"/>
      <line :x1="cell(3)" :x2="cell(3)" :y1="cell(6)" :y2="cell(7)"/>
      <line :x1="-borderWidth/2" :x2="cell(3)+borderWidth/2" :y1="cell(6)" :y2="cell(6)"/>
      <line :x1="0" :x2="0" :y1="cell(4)" :y2="cell(6)"/>
      <line :x1="0" :x2="0" :y1="0" :y2="cell(3)"/>
      <text :x="cell(4.5)" :y="cell(3)">Dining Room</text>
    </g>
    <!-- Lounge -->
    <g :transform="getXYTranslation(17, -offsetScale)">
      <polygon :points="`${cell(1)},0 ${offset(7)},0 ${offset(7)},${offset(6)} 0,${offset(6)} 0,${offset(1)} ${cell(1)},${offset(1)}`"
               :class="{ highlight: availableMoves.lounge }"/>
      <line class="door" :x1="0" :x2="cell(1)" :y1="offset(6)" :y2="offset(6)"/>
      <line :x1="cell(1)-borderWidth/2" :x2="offset(7)+borderWidth/2" :y1="0" :y2="0"/>
      <line :x1="offset(7)" :x2="offset(7)" :y1="0" :y2="offset(6)"/>
      <line :x1="cell(1)" :x2="offset(7)+borderWidth/2" :y1="offset(6)" :y2="offset(6)"/>
      <line :x1="0" :x2="0" :y1="offset(1)" :y2="offset(6)"/>
      <line :x1="-borderWidth/2" :x2="cell(1)+borderWidth/2" :y1="offset(1)" :y2="offset(1)"/>
      <line :x1="cell(1)" :x2="cell(1)" :y1="0" :y2="offset(1)"/>
      <text :x="cell(3.5)" :y="cell(3)">Lounge</text>
    </g>
    <!-- Hall -->
    <g :transform="getXYTranslation(9, -offsetScale)">
      <polygon :points="`0,${offset(0)+cell(1/2)} ${cell(1)},${offset(0)+cell(1/2)} ${cell(1)},${cell(1/2)} ${cell(5)},${cell(1/2)}
                        ${cell(5)},${offset(0)+cell(1/2)} ${cell(6)},${offset(0)+cell(1/2)} ${cell(6)},${offset(7)} 0,${offset(7)}`"
               :class="{ highlight: availableMoves.hall }"/>
      <line class="door" :x1="0" :x2="0" :y1="offset(4)" :y2="offset(5)"/>
      <line class="door" :x1="cell(2)" :x2="cell(4)" :y1="offset(7)" :y2="offset(7)"/>
      <line :x1="-borderWidth/2" :x2="cell(1)+borderWidth/2" :y1="offset(0)+cell(1/2)" :y2="offset(0)+cell(1/2)"/>
      <line :x1="cell(1)" :x2="cell(1)" :y1="cell(1/2)-cellLineWidth/2" :y2="offset(0)+cell(1/2)"/>
      <path :d="`M ${cell(1)} ${cell(1/2)} q ${cell(2)} ${-offset(0)-cell(1/2)} ${cell(4)} 0`"
            :class="{ highlight: availableMoves.hall }"/>
      <line :x1="cell(5)" :x2="cell(5)" :y1="cell(1/2)-cellLineWidth/2" :y2="offset(0)+cell(1/2)"/>
      <line :x1="cell(5)-borderWidth/2" :x2="cell(6)+borderWidth/2" :y1="offset(0)+cell(1/2)" :y2="offset(0)+cell(1/2)"/>
      <line :x1="cell(6)" :x2="cell(6)" :y1="offset(0)+cell(1/2)" :y2="offset(7)"/>
      <line :x1="cell(4)" :x2="cell(6)+borderWidth/2" :y1="offset(7)" :y2="offset(7)"/>
      <line :x1="-borderWidth/2" :x2="cell(2)" :y1="offset(7)" :y2="offset(7)"/>
      <line :x1="0" :x2="0" :y1="offset(5)" :y2="offset(7)"/>
      <line :x1="0" :x2="0" :y1="offset(0)+cell(1/2)" :y2="offset(4)"/>
      <text :x="cell(3)" :y="cell(3.5)">Hall</text>
    </g>
  </g>
</template>

<script>
import coordinates from '@/mixins/coordinates.mixin';

export default {
  name: 'Rooms',
  mixins: [coordinates],
  props: {
    cellLineWidth: Number,
    borderWidth: Number,
    availableMoves: Object
  }
};
</script>
