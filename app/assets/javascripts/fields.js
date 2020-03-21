$(function(){ 
  // 初期化処理
  var $battle_chars = [];
  var fields = [];
  $.ajax({
    type: 'GET',
    url: $("#field").attr('action'),
    dataType: 'json',
    success: function(data){
      $reserved_id = data.reserved_id
      data.battle_chars.forEach(d =>{
        $battle_chars.push(d);
      })
      data.fields.forEach(d => {
        fields.push(d);
      })
      // 敵PTの表示を逆さにする
      $battle_chars.forEach(b => {
        fields.forEach(f =>{
          if(f.char_id == b.char_id && b.team == 1){
            $(`#ID_${b.field_id}`).css("transform","rotate(180deg)");
          }else if(f.char_id == b.char_id && b.team == 0){
            $(`#ID_${b.field_id}`).css("transform","rotate(0deg)");
          }
        })
      })
    }})

  var battleStartFlag = 0;
  var reservedFlag = 1;
  for(var num = 257;num <= 512; num ++){
    $(`#ID_${num}`).hover(function(){
      $(this).css('background', '#fff');
      $(this).css('color', '#000');
      // $(`.status`).css('display', 'block');
    },function(){
      $(this).css('background', '');
      $(this).css('color', '');
      // $(`.status`).css('display', '');
    })
  }

  //攻撃関数
  var attack = function(field_id,spped,moveValue,char_name,team,b_attack,element_id){
    var attacking_team = -1;
    if(team == 0){
      attacking_team = 1;
    }else{
      attacking_team = 0;
    }
    var attackEffects = [-17,-16,-15,-1,0,1,15,16,17];
    while(spped >= 0){
      attackEffects.forEach(e => {
        // 攻撃エフェクトを表示
        $(`#ID_${field_id+e+(moveValue*spped)}`).css('opacity', '0').animate({'opacity': '1'}, 500);
        // 攻撃を実行
        $battle_chars.forEach(b => {
          if(b.field_id == field_id+e+(moveValue*spped) && b.team == attacking_team){
            var ratio = 0;
            switch(element_id){
              case 1:
                switch(b.element_id){
                  case 2:
                    ratio = 0.7;
                    break;
                  case 3:
                    ratio = 1.3;
                    break;
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 2:
                switch(b.element_id){
                  case 3:
                    ratio = 0.7;
                    break;
                  case 1:
                    ratio = 1.3;
                    break;
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 3:
                switch(b.element_id){
                  case 1:
                    ratio = 0.7;
                    break;
                  case 2:
                    ratio = 1.3;
                    break;
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 4:
                switch(b.element_id){
                  case 5:
                    ratio = 1.3;
                    break;
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 5:
                switch(b.element_id){
                  case 4:
                    ratio = 1.3;
                    break;
                  default:
                    ratio = 1;
                    break;
                }
                break;
            }
            console.log(`${b.name} attacked by ${char_name}, vitality ${b.vitality} to ${b.vitality-b_attack*ratio}`)
          }
        })
      })
      spped --;
    }
  }

  // 移動および画面左右端でのループ処理
  var loopMovement = function(field_id,nextPoint,char_name){
    if(nextPoint < 256){
      nextPoint += (256 -1);                      // 左端から右端にループする
    }else if(nextPoint >= 512){
      nextPoint += (-256 +1);                     // 右端から左端にループする
    }
    //nextPointが予約済みなら、nextPointが予約済みでないマスになるまで、nextPointを1増やす
    $reserved_id.forEach(r => {
      while(r == nextPoint){
        console.log(`${char_name} avoids ${nextPoint}`);
        nextPoint ++;
      }
    })
    //予約済みマスを更新
    $reserved_id = $reserved_id.filter(function( item ) { 
      return item !== field_id;
    });
    $reserved_id.push(nextPoint);
    $battle_chars.forEach(b =>{
      if(b.name == char_name){
        b.field_id = nextPoint;
      }
    })
    $(`#ID_${nextPoint}`).text(char_name);
  }

  var movement = function(spped,movement_id,field_id,char_name,team,b_attack,element_id){
    // 移動型ごとに処理を分ける
    switch(movement_id){
      // 直線往復型 ひたすら上か下に進む
      case 1:
        var moveSeeds = [-1,1];  // 上下左右斜めのうちランダムに移動する
        var moveSeed = Math.round(Math.random()*1);   // 0~7のランダムシードを生成
        var moveValue =  moveSeeds[moveSeed]; // 移動値を定義
        var nextPoint = field_id + moveValue*spped;         // 移動する
        loopMovement(field_id,nextPoint,char_name);
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
      // 散策型 ランダムな8方向に直進する
      case 2:                                         // 散策型
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];  // 上下左右斜めのうちランダムに移動する
        var moveSeed = Math.round(Math.random()*7);   // 0~7のランダムシードを生成
        var moveValue =  moveSeeds[moveSeed]; // 移動値を定義
        var nextPoint = field_id + moveValue*spped;         // 移動する
        loopMovement(field_id,nextPoint,char_name);
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
      // 追尾型 一番近い敵を横切るように移動する
      case 3:
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];  // 上下左右斜めのうちランダムに移動する
        var moveSeed = Math.round(Math.random()*7);   // 0~7のランダムシードを生成
        var moveValue =  moveSeeds[moveSeed] * spped; // 移動値を定義
        var nextPoint = field_id + moveValue;         // 移動する
        loopMovement(field_id,nextPoint,char_name);
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
    }
  }

  $("#field").on('click', function(){
    if(battleStartFlag == 0){
      battleStartFlag = 1;
      setInterval(reloadFields, 1000);
    }else{
      battleStartFlag = 0;
    }
  });

  var reloadFields = function(){
  if(battleStartFlag == 1){
    var faseNum = Number($("#field").attr('faseNum'));
    $.ajax({
      type: 'GET',
      url: $("#field").attr('action'),
      dataType: 'json',
      success: function(){
        if(reservedFlag == 1){
          reservedFlag = 0;
        }
        $battle_chars.forEach(b => {
          fields.forEach(field => {
            if(field.char_id == b.char_id){
              // 空じゃないマスのfaseNumを+1する
              $(`#ID_${field.id}`).css("background","#000");
              $(`#ID_${field.id}`).attr('faseNum',faseNum+1);
            }
          });
        })
        $battle_chars.forEach(b => {
          fields.forEach(field => {
            // faseNumが1多い行だけ移動関数を実行
            if(field.char_id == b.char_id && Number($(`#ID_${field.id}`).attr('faseNum')) == faseNum+1){
              // マスを全て空にする
              $(`#ID_${b.field_id}`).text("");
              // 移動および攻撃関数を実行
              movement(b.spped,b.movement_id,b.field_id,b.name,b.team,b.attack,b.element_id);
              // faseNumを元の値に戻す
              $(`#ID_${field.id}`).attr('faseNum',faseNum);
            }
          });
        })
        // faseNumを次のターンに向けて1増やす
        faseNum += 1;
        $("#field").attr('faseNum',faseNum);
        console.log(`fase${faseNum} is done.`);
        // 敵PTの表示を逆さにする
        $battle_chars.forEach(b => {
          fields.forEach(f => {
            if(f.char_id == b.char_id && b.team == 1){
              $(`#ID_${b.field_id}`).css("transform","rotate(180deg)");
            }else if(f.char_id == b.char_id && b.team == 0){
              $(`#ID_${b.field_id}`).css("transform","rotate(0deg)")
            }
          })
        })
        }
      })
    .fail(function() {
      alert('error');
    })
  }

  }
});