var items = ["リンゴ", "バナナ", "メロン", "バナナ"];
 
var result = items.filter(function( item ) {
  
  return item === 'バナナ';
  
});
 
console.log( result );