let styles; export default styles = [
  `.tabjf_editor-con {
    --editor-bg : #3e3e3e;
    background-color : var(--editor-bg);
    max-height : calc( var(--max-height, 200) * 1px);
    overflow   : auto;
  }`,
  `.tabjf_editor-con .tabjf_editor {
    --padding-left : 65px;
    color       : #FFF;
    position    : relative;
    min-height  : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
    padding-top : calc( var(--paddingTop, 0) * 1px )                        ;
    padding-left  : var(--padding-left);
    padding-right : 10px;
    counter-reset : editor-line;
    font-family   : Consolas, monospace;
    counter-set : editor-line var(--counter-current, 0);
    padding-top : calc( var(--paddingTop, 0) * 1px );
    width       : calc(var(--scroll-width, 100%) * 1px + 5px );
    min-width   : calc(100% - var(--padding-left) - 10px);
  }`,
  `.tabjf_editor-con .tabjf_editor p {
    position   : relative;
    min-height : 20px    ;
    max-height : 20px    ;
    height     : 20px    ;
    cursor     : text    ;
    display    : flex    ;
    margin     : 0       ;
    padding    : 0       ;
  }`,
  `.tabjf_editor-con .tabjf_editor p::before {
    position   : absolute;
    left       : -35px   ;
    top        : 0       ;
    width      : 30px    ;
    text-align : center  ;
    color      : var(--color-grey)   ;
    content    : counter(editor-line);
    border-right      : 1px solid var(--color-grey);
    counter-increment : editor-line   ;
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
    background-color : #FFF;
  }`,
  `.tabjf_editor-con .tabjf_editor p .spaces {
    background-image: url("data:image/svg+xml,%3Csvg%20id%3D%22Layer_1%22%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2010%206.4%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23fff%3Bopacity%3A0.2%3B%7D.cls-2%7Bopacity%3A0%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Crect%20class%3D%22cls-1%22%20x%3D%222.74%22%20y%3D%222.74%22%20width%3D%224.53%22%20height%3D%224.53%22%20transform%3D%22translate(5%20-3.87)%20rotate(45)%22%2F%3E%3Crect%20class%3D%22cls-2%22%20y%3D%221.16%22%20width%3D%220.27%22%20height%3D%224.09%22%2F%3E%3Crect%20class%3D%22cls-2%22%20x%3D%229.73%22%20y%3D%221.16%22%20width%3D%220.27%22%20height%3D%224.09%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }`,
  `.tabjf_editor-con .tabjf_editor p .mistake {
    color : #d0d0d0;
    position: relative;
  }`,
  `.tabjf_editor-con .mistake::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background: #F00;
    top: 100%;
    left: 0;
  }`
];
