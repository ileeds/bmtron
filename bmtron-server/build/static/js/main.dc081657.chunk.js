(this["webpackJsonpbmtron-client"]=this["webpackJsonpbmtron-client"]||[]).push([[0],{124:function(n,t){},210:function(n,t,e){"use strict";e.r(t);var r=e(1),c=e(0),o=e.n(c),i=e(76),a=e.n(i),u=(e(88),e(2)),f=e(3),s=e(77),d=e.n(s),b=e(41),l=e(78),j=e.n(l)()("https://cd0ea6bbbd9e.ngrok.io"),v=function(){var n=Object(c.useState)({}),t=Object(b.a)(n,2),e=t[0],r=t[1];return Object(c.useEffect)((function(){return j.on("GameState",(function(n){r(n)})),function(){return j.disconnect()}}),[]),e},w=function(){var n=Object(c.useState)(),t=Object(b.a)(n,2),e=t[0],r=t[1];return Object(c.useEffect)((function(){return j.on("PlayerColor",(function(n){r(n)})),function(){return j.disconnect()}}),[]),e},O=function(){j.emit("StartGame")},x=function(n,t){j.emit("KeyDown",{key:n,color:t})};function g(){var n=Object(u.a)(["\n  width: 100%;\n  text-align: center;\n  margin-top: 16px;\n  margin-bottom: 16px;\n  font-size: 3vw;\n"]);return g=function(){return n},n}var h=f.a.div(g()),p=function(){var n=w(),t=v(),e=t.countdown,c=t.winner,o="";return"DRAW"===c?o="Draw":c?o="".concat(d()(c)," wins!"):e?o=e:n&&(o="You are ".concat(n)),Object(r.jsx)(h,{children:o})},m=e(82),k=e.n(m);function y(){var n=Object(u.a)(["\n  width: 100%;\n  text-align: center;\n  margin-top: 16px;\n  margin-bottom: 16px;\n  font-size: 3vw;\n"]);return y=function(){return n},n}var C=f.a.div(y()),E=function(){var n=v(),t=n.countdown,e=n.activeColors;return k()(e)<2?null:Object(r.jsx)(C,{onClick:O,children:null===t&&"Click me to start"})},S=e(11),A=e.n(S);function D(){var n=Object(u.a)(["\n  display: flex;\n  border: 1px solid black;\n  background-color: ",";\n  height: 0.5vw;\n  width: 0.5vw;\n"]);return D=function(){return n},n}var L=f.a.div(D(),(function(n){var t=n.color;return t||"white"})),F=function(n){var t=n.color;return Object(r.jsx)(L,{color:t})},z=Object(c.memo)(F),P=function(){var n=w(),t=function(t){var e=t.key;if(!t.repeat)switch(e){case"ArrowUp":case"w":x("u",n);break;case"ArrowDown":case"s":x("d",n);break;case"ArrowLeft":case"a":x("l",n);break;case"ArrowRight":case"d":x("r",n)}};Object(c.useEffect)((function(){return window.addEventListener("keydown",t),function(){window.removeEventListener("keydown",t)}}));var e=v().board;return A()(e,(function(n,t){return Object(r.jsx)("div",{children:A()(n,(function(n,e){return Object(r.jsx)(z,{color:n},"".concat(t).concat(e))}))},t)}))};function B(){var n=Object(u.a)(["\n  background-color: ",";\n  color: white;\n  width: 4vw;\n  padding-left: 0.5vw;\n  margin-left: 0.5vw;\n  padding-right: 0.5vw;\n  margin-right: 0.5vw;\n  display: inline;\n"]);return B=function(){return n},n}function G(){var n=Object(u.a)(["\n  width: 100%;\n  text-align: center;\n  margin-top: 16px;\n  margin-bottom: 16px;\n  font-size: 3vw;\n"]);return G=function(){return n},n}var I=f.a.div(G()),J=f.a.div(B(),(function(n){return n.color})),R=function(){var n=v().scores;return Object(r.jsx)(I,{children:A()(n,(function(n,t){return Object(r.jsx)(J,{color:t,children:n})}))})};function T(){var n=Object(u.a)(["\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin-top: 5%;\n"]);return T=function(){return n},n}var K=f.a.div(T()),M=function(){return Object(r.jsxs)(K,{children:[Object(r.jsx)(R,{}),Object(r.jsx)(p,{}),Object(r.jsx)(P,{}),Object(r.jsx)(E,{})]})},U=function(){return Object(r.jsx)(M,{})},W=function(n){n&&n instanceof Function&&e.e(3).then(e.bind(null,211)).then((function(t){var e=t.getCLS,r=t.getFID,c=t.getFCP,o=t.getLCP,i=t.getTTFB;e(n),r(n),c(n),o(n),i(n)}))};a.a.render(Object(r.jsx)(o.a.StrictMode,{children:Object(r.jsx)(U,{})}),document.getElementById("root")),W()},88:function(n,t,e){}},[[210,1,2]]]);
//# sourceMappingURL=main.dc081657.chunk.js.map