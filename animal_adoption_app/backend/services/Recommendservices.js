const Level_MAP={
    low : 1,
    medium : 2,
    high : 3,

};

function matchLevel(animalLevel,userLevel,maxScore){
    const a = Level_MAP[animalLevel];
    const u =Level_MAP[userLevel];

    if(!a||!u)return 0;

    const diff = Math.abs(a-u);
    if(diff===0)return maxScore; //完全符合
    if(diff===1)return maxScore*0.5//接近
    return 0;

}

export function calculateScore(animal,formData){
    let score = 0;
    const reasons = [];

    if(animal.type===formData.type){
        score+=20;
        reasons.push("類型符合");
    }
    const activityScore=matchLevel(
        animal.activity_level,
        formData.activity_level,
        15
    );
     if (activityScore > 0) {
    score += activityScore;
    reasons.push("活動量相近");
  }

  // 空間需求
  const spaceScore = matchLevel(
    animal.space_requirement,
    formData.space_requirement,
    10
  );
  if (spaceScore > 0) {
    score += spaceScore;
    reasons.push("居住空間適合");
  }

  // 毛髮整理
  const sheddingScore = matchLevel(
    animal.shedding_level,
    formData.shedding_level,
    10
  );
  if (sheddingScore > 0) {
    score += sheddingScore;
    reasons.push("毛髮整理接受度相符");
  }

  // 照顧時間
  const timeScore = matchLevel(
    animal.time_commitment,
    formData.time_commitment,
    15
  );
  if (timeScore > 0) {
    score += timeScore;
    reasons.push("照顧時間需求相符");
  }

  // 新手友善
  if (
    formData.suitable_for === "beginner" &&
    animal.suitable_for === "beginner"
  ) {
    score += 10;
    reasons.push("適合新手飼主");
  }

  //traits 多選
  if(Array.isArray(formData.traits)){
    formData.traits.forEach((trait)=>{
        if(animal.traits?.includes(trait)){
            score+=5;
            reasons.push(`符合偏好個性:${trait}`);

        }
    });
  
}
return {
    score:Math.round(score),
    reasons,//前端可顯示為什麼推薦
};
}
