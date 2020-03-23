// 初期化処理
$(function(){ 
  var $team_data = -1;
  var overflowFlag = 1;
  $(".war-main-chat__message-form").append("<div>Welcome to CHARACTER'S WAR!</div>");
  var $faseNum = 0;

  var identifyColor = function(){
  // チームの色分け
  $battle_chars.forEach(b => {
    fields.forEach(f =>{
      // team == 1なら敵チーム
      if(f.char_id == b.char_id && b.team == 1){
        $(`#ID_${b.field_id}`).css("color","#f00");
      // team == 0なら自チーム
      }
      if(f.char_id == b.char_id && b.team == 0){
        $(`#ID_${b.field_id}`).css("color","#0f0");
      }
    })
  })
  }

  // 自チームと敵チームの文字列のみ格納する変数(配列)
  var team_chars = [];
  var enemy_chars = [];
  // 戦闘に必要な文字のパラメータをテーブルから受け取り、格納するグローバル変数(配列)
  var $battle_chars = [];
  // フィールドの情報をテーブルから受け取り、格納する変数(配列)
  var fields = [];
  // charsテーブルの情報を格納する変数(配列)
  var chars = [];
  
  //ビューに初期値を渡すために非同期通信を使用する
  $.ajax({
    type: 'GET',
    url: $("#field").attr('action'),
    dataType: 'json',
    success: function(data){
      // すでに文字が入っているマスを格納したインスタンス変数をjsonから受け取る
      $reserved_id = data.reserved_id
      // jsonに格納したテーブルの情報を配列で受け取る
      data.team_chars.forEach(t =>{
        team_chars.push(t);
      })
      data.battle_chars.forEach(b =>{
        $battle_chars.push(b);
      })
      data.fields.forEach(f => {
        fields.push(f);
      })
      data.chars.forEach(c =>{
        chars.push(c);
      })
      $battle_chars.forEach( b => {
        if(b.team == 1){
          enemy_chars.push(b.name);
        }
      })
      identifyColor();
    }
  })

  // ステータス調整用関数
  var fixStatus = function(chars,b){
    // b.attack = Math.ceil(b.attack*4/chars.length);
    b.vitality = Math.ceil(b.vitality*4/chars.length);
    b.speed = Math.ceil(b.speed*4/chars.length);
  }

  // 戦闘中かどうかを判定するフラグ
  var battleStartFlag = 0;
  // カーソルを合わせたマスを少し暗くする処理
  for(var num = 257;num <= 512; num ++){
    $(`#ID_${num}`).hover(function(){
      $(this).css('opacity', '0.3');
    },function(){
      $(this).css('opacity', '1');
    })
  }

  //攻撃関数
  var attack = function(field_id,speed,moveValue,char_name,team,b_attack,element_id){
    // 被攻撃チームのIDを格納する変数
    var attacking_team = -1;
    // 自チームが攻撃する場合、被攻撃チームは1(敵チーム)
    if(team == 0){
      attacking_team = 1;
    // 自チームが攻撃される場合、被攻撃チームは0(自チーム)
    }else{
      attacking_team = 0;
    }
    // 攻撃を文字自身の周囲8マスに反映させるための配列
    var attackEffects = [-17,-16,-15,-1,0,1,15,16,17];
    // スピードの数値分攻撃を繰り返す
    while(speed >= 0){
      attackEffects.forEach(e => {
        // 攻撃エフェクトを表示
        $(`#ID_${field_id+e+(moveValue*speed)}`).css('opacity', '0').animate({'opacity': '1'}, 500);
        // 攻撃を実行
        $battle_chars.forEach(b => {
          // ifで敵対チームにだけ攻撃を与える
          if(b.field_id == field_id+e+(moveValue*speed) && b.team == attacking_team){
            // 属性相性を定義
            var ratio = 0;
            switch(element_id){
              // 火属性が攻撃する場合の倍率
              case 1:
                switch(b.element_id){
                  // 相手が水だと攻撃力が減る
                  case 2:
                    ratio = 0.7;
                    break;
                  // 相手が木だと攻撃力が増える
                  case 3:
                    ratio = 1.3;
                    break;
                  // 相手が火、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 2:
              // 水属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が木だと攻撃力が減る
                  case 3:
                    ratio = 0.7;
                    break;
                  // 相手が火だと攻撃力が増える
                  case 1:
                    ratio = 1.3;
                    break;
                  // 相手が水、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 3:
              // 木属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が火だと攻撃力が減る
                  case 1:
                    ratio = 0.7;
                    break;
                  // 相手が水だと攻撃力が増える
                  case 2:
                    ratio = 1.3;
                    break;
                  // 相手が木、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              // 光属性が攻撃する場合の倍率
              case 4:
                switch(b.element_id){
                  // 相手が闇だと攻撃力が増える
                  case 5:
                    ratio = 1.3;
                    break;
                  // 相手が火、水、木、光だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 5:
              // 闇属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が光だと攻撃力が増える
                  case 4:
                    ratio = 1.3;
                    break;
                  // 相手が火、水、木、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
            }
            // ダメージ分の体力を減らす処理
            b.vitality -= parseInt(b_attack*ratio);
            var teamText;
            if(b.team == 0){
              teamText = "あなた";
            }
            if(b.team == 1){
              teamText = "敵";
            }
            if(b.vitality <= 0){
              $(".war-main-chat__message-form").append(`<div>${teamText}の「 ${b.name} 」が退場！</div>`);
              $('.war-main-chat__message-form').animate({ scrollTop: $('.war-main-chat__message-form')[0].scrollHeight},10);
            }
          }
        })
      })
      // スピードを1減らして次のループへ。スピード0になったら終了
      speed --;
    }
  }

  // 移動および画面左右端でのループ処理
  var loopMovement = function(field_id,nextPoint,char_name,team){
    // 左端から右端にループする
    if(nextPoint < 256){
      nextPoint += (256 -1);
    // 右端から左端にループする
    }else if(nextPoint >= 512){
      nextPoint += (-256 +1);
    }
    //nextPointが予約済みなら、nextPointが予約済みでないマスになるまで、nextPointを1増やす
    $reserved_id.forEach(r => {
      while(r == nextPoint){
        nextPoint ++;
      }
    })
    //予約済みマスを更新
    $reserved_id = $reserved_id.filter(function( item ) { 
      return item !== field_id;
    });
    $reserved_id.push(nextPoint);
    // nextPointが確定したので、文字の位置(b.field_id)を更新する
    $battle_chars.forEach(b =>{
      if(b.name == char_name && b.team == team){
        b.field_id = nextPoint;
      }
    })
    // 表示位置を更新する
    $(`#ID_${nextPoint}`).text(char_name);
  }

  //移動関数
  var movement = function(speed,movement_id,field_id,char_name,team,b_attack,element_id){
    // 移動型ごとに処理を分ける
    switch(movement_id){
      // 直線往復型 ひたすら上か下に進む
      case 1:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-1,1];
        // 左右にも1マス動く
        var moveRightLeftSeeds = [-16,16];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*1);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed];
        // 移動する
        var nextPoint = field_id + moveValue*speed + moveRightLeftSeeds[moveSeed];
        //ループ処理
        loopMovement(field_id,nextPoint,char_name,team);
        //攻撃処理
        attack(field_id,speed,moveValue,char_name,team,b_attack,element_id);
        break;
      // 散策型 ランダムな8方向に直進する
      case 2:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*7);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed];
        // 移動する
        var nextPoint = field_id + moveValue*speed;
        // ループ処理
        loopMovement(field_id,nextPoint,char_name,team);
        // 攻撃処理
        attack(field_id,speed,moveValue,char_name,team,b_attack,element_id);
        break;
      // 追尾型 一番近い敵を横切るように移動する
      case 3:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*7);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed] * speed;
        // 移動する
        var nextPoint = field_id + moveValue;
        // ループ処理
        loopMovement(field_id,nextPoint,char_name,team);
        // 攻撃処理
        attack(field_id,speed,moveValue,char_name,team,b_attack,element_id);
        break;
    }
  }

  //チーム選択
  $(".team").on('click', function(){
    $team_data = $(this).attr("team_id")
    // 予約済みマスをリセット
    $reserved_id = [];
    enemy_chars = [];
    // 全てのマスを空にする
    fields.forEach(f => {
      $(`#ID_${f.id}`).text("");
    })
    // 文字一覧をリセット
    $battle_chars = [];
    dummy_id = 0;
    for(var num = 0;num < 16;num ++){
      chars.forEach(c => {
        if(c.name == team_chars[num]){
          var hash = {"id":dummy_id,"name":c.name,"field_id":364+num*16-(Math.floor(team_chars.length/2)-2)*16,"char_id":c.id,"vitality":c.vitality,"attack":c.attack,"speed":c.speed,"battle_id":c.battle_id,"movement_id":c.movement_id,"element_id":c.element_id,"team":0};
          $(`#ID_${hash.field_id}`).text(c.name);
          $reserved_id.push(hash.field_id);
          $battle_chars.push(hash);
          dummy_id ++;
        }
        if(c.name == $(this).attr("data").split("")[num]){
          fields.forEach(f =>{
            if(f.id == 358+num*16-(Math.floor($(this).attr("data").split("").length/2)-2)*16){
              f.char_id = c.id;
            }
          })
          var hash = {"id":dummy_id,"name":c.name,"field_id":358+num*16-(Math.floor($(this).attr("data").split("").length/2)-2)*16,"char_id":c.id,"vitality":c.vitality,"attack":c.attack,"speed":c.speed,"battle_id":c.battle_id,"movement_id":c.movement_id,"element_id":c.element_id,"team":1};
          $(`#ID_${hash.field_id}`).css('opacity', '0').animate({'opacity': '1'}, 500);
          $(`#ID_${hash.field_id}`).text(c.name);
          enemy_chars.push(c.name);
          $reserved_id.push(hash.field_id);
          $battle_chars.push(hash);
          dummy_id ++;
        }
      })
    }
    $battle_chars.forEach( b =>{
      if(b.team == 1){
        fixStatus(enemy_chars,b);
      }else{
        fixStatus(team_chars,b);
      }
    })
    identifyColor();
  })

  // クリックで戦闘開始
  $("#field").on('click', function(){
    if(battleStartFlag == 0 && overflowFlag == 1){
      // 勝敗がついた後に停止するための変数
      battleStartFlag = 1;
      // 画面を更新
      setInterval(reloadFields, 300);
    }
  });

  // 画面更新処理
  var reloadFields = function(){
    //勝敗判定用の変数
    var remain_chars = 0;
    var remain_enemies = 0;
    //勝敗がついていない場合だけ実行する
    if(battleStartFlag == 1){
      //非同期通信
      $.ajax({
        type: 'GET',
        url: $("#field").attr('action'),
        dataType: 'json',
        success: function(){
          $reserved_id.forEach(r => {
            // 全てのマスを空にする
            $(`#ID_${r}`).text("");
            $battle_chars.forEach(b => {
              if(r == b.field_id){
                if(b.vitality > 0){
                  if(b.team == 0){
                    remain_chars ++;
                  }else if(b.team == 1){
                    remain_enemies ++;
                  }
                  movement(b.speed,b.movement_id,b.field_id,b.name,b.team,b.attack,b.element_id);
                }else if(b.vitality <= 0){
                  $(`#ID_${b.field_id}`).text("");
                  b.field_id = -1;
                }
              }
            })
          })
          // $faseNumを次のターンに向けて1増やす
          $faseNum += 1;
          // 勝敗を判定する
          if(overflowFlag == 1){
            if(remain_chars == 0 && remain_enemies == 0){
              overflowFlag = 0;
              $(".war-main-chat__message-form").append("<div>DRAW.</div>");
              battleStartFlag = 0;
            }else if(remain_enemies == 0){
              overflowFlag = 0;
              $(".war-main-chat__message-form").append("<div>YOU WIN!</div>");
              battleStartFlag = 0;
              $.ajax({
                url: $("#field").attr('win'),
                type: 'GET',
                data: { content: $team_data },
                datatype: "json"
              })
            }else if(remain_chars == 0){
              overflowFlag = 0;
              $(".war-main-chat__message-form").append("<div>YOU LOSE...!</div>");
              battleStartFlag = 0;
              $.ajax({
                url: $("#field").attr('lose'),
                type: 'GET',
                data: { content: $team_data },
                datatype: "json"
              })
            }
          }
          $('.war-main-chat__message-form').animate({ scrollTop: $('.war-main-chat__message-form')[0].scrollHeight},10);
          identifyColor();
          }
        })
      .fail(function() {
        alert('error');
      })
    }
  }
});