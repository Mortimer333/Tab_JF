let styles; export default styles = [
  `.tabjf_editor-con {
    max-height : calc( var(--max-height, 200) * 1px);
    overflow   : auto;
    background : #FFF;
    color      : #000;
  }`,
  `.tabjf_editor-con .tabjf_editor {
    position    : relative;
    min-height  : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
    height      : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
    padding-top : calc( var(--paddingTop, 0) * 1px )                        ;
    padding-left  : var(--padding-left);
    padding-right : 10px;
    padding-top : calc( var(--paddingTop, 0) * 1px );
    width       : calc(var(--scroll-width, 100%) * 1px + 5px );
    min-width   : calc(100% - var(--padding-left) - 10px);
  }`,
  `.tabjf_editor-con .tabjf_editor p {
    position   : relative;
    line-height: 20px    ;
    min-height : 20px    ;
    max-height : 20px    ;
    height     : 20px    ;
    cursor     : text    ;
    display    : flex    ;
    margin     : 0       ;
    padding    : 0       ;
  }`,
  `.tabjf_editor-con .tabjf_editor p::after {
    display : block;
    content : '█'  ;
    opacity : 0    ;
  }`,
  `.tabjf_editor-con .tabjf_editor p span {
    display     : block ;
    white-space : nowrap;
    flex-shrink : 0     ;
  }`,
  `.tabjf_editor-con .tabjf_editor p span:last-child {
    margin-right: 10px;
  }`,
  `@keyframes tabjf_blink {
    0%   { opacity: 1; }
    50%  { opacity: 0; }
    100% { opacity: 1; }
  }`,
  `.tabjf_editor-con .tabjf_editor .caret {
    width     : 1px ;
    height    : 20px;
    position  : absolute;
    animation : tabjf_blink 1s linear infinite;
    background-color : #000;
  }`
];
