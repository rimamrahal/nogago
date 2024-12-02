    /** load all the images, and remember to preload before starting the experiment */


///////////////////////////////////////////////////////////////////////////////////////////////////
//House Keeping/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


   /* preload images */
    var preload = {
      type: jsPsychPreload,
      images: [
        '../img/comp_checkG_YouTop_GroupTop0.png', 
        '../img/comp_checkG_YouBottom_GroupBottom0.png',  
        '../img/comp_checkG_YouTop_GroupBottom0.png', 
        '../img/comp_checkG_YouBottom_GroupTop0.png', 
        '../img/comp_checkG_YouTop_GroupTop1.png', 
        '../img/comp_checkG_YouBottom_GroupBottom1.png', 
        '../img/comp_checkG_YouTop_GroupBottom1.png', 
        '../img/comp_checkG_YouBottom_GroupTop1.png', 
        '../img/comp_checkG_YouTop_GroupTop2.png', 
        '../img/comp_checkG_YouBottom_GroupBottom2.png',
        '../img/comp_checkG_YouTop_GroupBottom2.png', 
        '../img/comp_checkG_YouBottom_GroupTop2.png', 
        '../img/instruct1.png',
        '../img/instruct0.png']
    };

    var fixation_duration = 1000;
    var successExp = false;
    var resize_screen = false;

    var point_size = 50;
    var threshold = 0.7; // at least 70% of gazes must be inside a given ROI to be considered accurate (threshold)
    var recalibrate_criterion = 0.2; // if at least 2 ROIs (2 points out of 9 total points shown = 0.22) are below the threshold set above, this will trigger recalibration in the initial validation phases (not while the task is running)
    var calibration_mode = 'view';

    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }

    var jsPsych = initJsPsych({
      override_safe_mode: true,
      extensions: [
        {type: jsPsychExtensionWebgazer}
      ], 
      on_finish: () => on_finish_callback(),
      on_close: () => on_finish_callback(),
      on_trial_finish: function () {if(successExp) {
        closeFullscreen();
        document.body.style.cursor = 'auto';
        jsPsych.endExperiment(`<div style="max-width: 1000px;">This is the end of the experiment. Thanks for taking part!
                    <br><br>Your completion code is: <b> 189273</b>. You can enter it at Prolific.
                    <br><br>The webcam will turn off when you close the browser. You can close the browser when you have copied your completion code.
                    <br><br>Our goal was to study which information people take into consideration when they decide about conforming to rules in different context.</br>
                     
                     
        </div>`);
        }
    }

    });

    stimuli_data_r1;
    stimuli_data;
    ball_data_r1;
    ball_data;

    var subject_id = jsPsych.randomization.randomID(7);
    var participant_stimuli_list = ['you_top', "top_down"];
    var participant_otherinfostimuli_list = ['rule_top', "rule_down"];
    var participant_ball_list = ['rule_top', "rule_down"];
    var participant_LMR_list = ['0','1','2'];
    var participant_payoff_order = (jsPsych.randomization.shuffle(participant_stimuli_list)[1] == 'you_top');
    var participant_otherinfo_order = (jsPsych.randomization.shuffle(participant_otherinfostimuli_list)[1] == 'rule_top');
    var participant_ball_order = (jsPsych.randomization.shuffle(participant_ball_list)[1] == 'rule_top');
    var participant_LMR_order = (jsPsych.randomization.shuffle(participant_LMR_list)[1]);

    console.log("participant_id: " + subject_id);
    console.log("participant_payoff_order: " + participant_payoff_order);
    console.log("participant_otherinfo_order: " + participant_otherinfo_order);
    console.log("participant_ball_order:" + participant_ball_order);
    console.log("participant_LMR_order: " + participant_LMR_order);


    stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
    ball_data = jsPsych.randomization.shuffle(ball_data);
    console.log(stimuli_data);

    stimuli_data_r1 = jsPsych.randomization.shuffle(stimuli_data_r1);
    ball_data_r1 = jsPsych.randomization.shuffle(ball_data_r1);

    function makeSurveyCode(status) {
      uploadSubjectStatus(status);
      var prefix = {'success': 'cg', 'failed': 'sb'}[status]
      return `${prefix}${subject_id}`;
    }
    
    function uploadSubjectStatus(status) {
      $.ajax({
        type: "POST",
        url: "/subject-status",
        data: JSON.stringify({subject_id, status}),
        contentType: "application/json"
      });
    }

     
///////
/////// SET UP WEBCAM AND EYE-TRACKING
///////

// INITIATLIZE CAMERA
var init_camera = {
  type: jsPsychWebgazerInitCamera,
  on_finish: function () {
    document.body.style.cursor = 'none'
  }
};

// CALIBRATION INSTRUCTION 
var calibration_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div>
         <font size = 4px font color = "magenta">      <p> We record your eye movements in this decision task.</p>
         <p> You need to help the camera get a good view of your eyes. To do that, it's <b>IMPORTANT</b> that you follow these rules: <br/> <br/> <br/></font>
         <img height="200px" width="1000px" src="../img/instruct1.png"><br/>
         <br><br/>
        Keep lights in front of you. No windows or lamps behind you. <br/> <br/>
         <br><br/>
         On the next page, you will start the eye tracking. Use the rules above.                 <br><br/>
         <div>
            After that, you will teach the computer to track your eyes.<br/>
            You will see a <b>black dot</b> on the screen.<br/>
            Look directly at each dot until it goes away.<br/>
            Then, <b>move your eyes</b> to look at the next dot, and repeat.<br/>
      <br>
         <font   >Press <b>SPACE</b> to start eye tracking! </font></div
  `,
  choices: [' '], 
  
  post_trial_gap: 1000
};

// CALIBRATION PROCEDURE
var calibration = {
  type: jsPsychWebgazerCalibrate,
  calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
  repetitions_per_point: 1 ,
  calibration_mode: 'view',
  time_per_point: 2500, 
  randomize_calibration_order: true,
};

// VALIDATION INSTRUCTIONS
var validation_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Let's do this again. </p>
    <p>Keep your head still. Move your eyes to look at each dot.</p>
    Press <b>SPACE</b> to continue!`,
  choices: [' '],
  post_trial_gap: 1000
};

// VALIDATION PROCEDURE
var validation_points_array = [[25,25], [25,75], [75,25], 
  [75,75], [25,50], [50,50],
  [75,50], [50,25], [50,75]];
    var validation_points_trial = jsPsych.randomization.shuffle(validation_points_array);

var validation = {
  type: jsPsychWebgazerValidate,
  validation_points: validation_points_trial.slice(0, 9),
  show_validation_data: false,
  roi_radius: 150,
  validation_duration: 2000,
  dot_threshold: threshold,
  data: {
    task: 'validate'
  },
  on_finish: (data) => {
    console.log("Validation Data:", data.percent_in_roi);
    console.log("Below Threshold Count:", data.percent_in_roi.filter(x => x < threshold).length);
  }
  
};


var recalibrateInstruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>The accuracy of the webcam is a little lower than we'd like.</p>
    <p>Let's try teaching the camera where you are looking one more time.</p>
    <br></br>
    <p>When you are ready, press the <b>SPACE BAR</b> to recalibrate.  </p>
  `,
  choices: [' '],
}



var recalibrate = {
  timeline: [recalibrateInstruction, calibration, validation_instructions, validation],
  conditional_function: function(){
    var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
    var below_threshold_count = validation_data.percent_in_roi.filter(function(x) {
      var minimum_percent_acceptable = threshold;
      return x < minimum_percent_acceptable}).length;

      return below_threshold_count/9 >= recalibrate_criterion;

    // return validation_data.percent_in_roi.some(function(x){
    //   var minimum_percent_acceptable = threshold;
    //   return x < minimum_percent_acceptable;
    // });
  },
  data: {
    phase: 'recalibration'
  }
}

  
  // RECALIBRATION 
  var cali_vali_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div>We need to check the webcam again.  </br>
    Look at each dot until it goes away. Look with your eyes. Don’t move your head.</br>
     <br></br>
     Press <b>SPACE</b> to begin!</div>`,
    choices: [' '],
    post_trial_gap: 1000
  };

  // FIXATIONS TO CALIBRATE
  var fixation_cali = {
      type: jsPsychWebgazerCalibrate,
      calibration_points: [[90,10], [10,90] ,[10,10], [50,50], [25,25], [25,75], [75,25], [75,75], [90,90]],
      repetitions_per_point: 1,
      calibration_mode: 'view',
      time_per_point: 2500, 
      randomize_calibration_order: true,
    };

  // FIXATIONS TO VALIDATE
  var fixation1 = {
      type: jsPsychWebgazerValidate,
      validation_points: [[25,25], [25,75], [75,25], [75,75]],
      show_validation_data: false,
      roi_radius: 150,
      validation_duration: 2000,
      on_finish: (data) => {
            // Calculate the below threshold count
            const calivali_below_threshold_count = data.percent_in_roi.filter(x => x < threshold).length;

            // Save the data to the dataset
            data.calivali_below_threshold_count = calivali_below_threshold_count; // Save count of low accuracy points
            data.calivali_percent_in_roi_data = data.percent_in_roi; // Save full ROI data as an array

      },
      on_start: (fixation1) => fixation1.validation_points = jsPsych.randomization.shuffle(validation_points_array).slice(0,3)
    };

    // FIXATION CROSS
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p id = "fix" style="font-size:40px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: fixation_duration,
  extensions: [
    {
      type: jsPsychExtensionWebgazer,
      params: {targets: ['#fix']}
    }]
};
  

///////////////////////////////////////////////////////////////////////////////////////////////////
//Participant Introduction/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

    var start_exp_survey_trial = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: "What's your Prolific ID (needed for bonus payment)?", rows: 2, columns:50 , required:true, 
          name: 'prolific_id'}, 
      ],
      preamble: `<div>Welcome to this study! </div>`,
    };


    /** full screen */
    var fullscreenEnter = {
      type: jsPsychFullscreen,
      message: `<div> Before we begin, please close any unnecessary browser tabs, programs or applications on your computer. <br/>
      This will help the study run more smoothly and ensure that no popups or alerts can interfere with the study.    <br/>
      The study will switch to fullscreen mode after this page.    <br/>
      <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>   
      When you are ready to begin, press the button.<br> <br></div>
    `,
      fullscreen_mode: true,
      on_finish: function () {
      //   document.body.style.cursor = 'none'
      window.onresize = resize
      function resize() {
        if(successExp && !resize_screen){
          resize_screen = false;
          console.log("end experiment resize");
        } else{
          resize_screen = true;
          console.log("Resized!");
          alert("You exited the full screen mode! The experiment cannot continue!");
          // location.reload(true);
          // window.location.href = window.location;
          window.location.href = "../views/failed.html";
          
        }
      }
    }
    };

const glasses_screening = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p> In the current study, one of our goals is to study eye-movements. 
              <br>Glasses often make it impossible to do so because there are reflections on the lenses. 
              <br>You can therefore only take part if you are NOT wearing glasses. 
              <br>It is ok to take part if you can take your glasses off now and still read very small print on the screen.
              <br><br> <div style="font-size: 10px !important;">If you cannot read this WITHOUT glasses, you cannot take part!</div> 
              <br><br>Please be honest and indicate below if you can take part or not. If you cannot, you will still receive a payment of 10¢ for your time. We will redirect to back to Prolific.  
              <br><br><br>Please confirm that you are not wearing glasses and can proceed with this study.</p>
      `,
      choices: ['Not wearing glasses and can take part.', 'Cannot take part because wearing glasses.'],
      on_finish: function(data) {
          // Check if the answer is "Cannot take part"
          if (data.response === 1) {  // 0 corresponds to the first button ("Yes")
              // If they are wearing glasses, redirect and end the experiment
              window.location.href = "https://www.example.com/redirect-page";  // Replace with your desired URL
          } else {
              // Otherwise, continue with the experiment
              console.log("Participant chose no glasses, continuing the experiment.");
          }
      },
      data: {
        name: 'glasses_screening'
      }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////
//Social Value Orientation/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

    // INSTRUCTIONS
    var SVO_instruction = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: ` <div style="width: 80%; margin: auto;">
      <p> In this task, you are randomly paired with another participant.
      We will call this participant the <b>other</b>. 
      You do not know each other, and you will not learn who the other person is after the experiment. </p>
      <p> You will make decisions about giving points to you and to this other person. 
      This person will not know whose choices will affect them. </p> 
      <p> 
      In this task, you decide how many points to give to yourself and the other person by <b> selecting the button above the options </b>. 
      You can only choose one option for each question. </p>
      <p> The points are worth money, and will give both you and the other person an additional payment. </p>
      <p> Look at the example below. Someone chose the option to get 40 points for themselves. In this option, the anonymous other person gets 50 points.</p>
      
      <img height="150px" src="../img/svo_example.jpg"><br/>

      <p> There are no right or wrong answers, this is all about personal preferences.
      Make your choice and	<b> click on the button above the option you want. </b>	
      </p>
      <p>
      At the end of the study, it will be randomly chosen whether YOUR choice (determining the
        payoffs for yourself and another participant)
      will be implemented OR if the choice of another participant will be implemented for you. 
      <br> 
      <br>
      <b> 100 points are worth 0.37$ (about 21 Peso).  </b>

      </p>
      <br>
      Press <b>SPACE</b> to begin!
      </div>`,
      choices: [' ']
    };

    var SVO_prompt = "You get: <br> | <br> Other gets:";

    // TASK 

    var SVO_trial_likert1 = {
      type: jsPsychSVOSurveyLikert,
      questions:[
        {
          prompt: SVO_prompt, 
          name: 'SVO_1', 
          labels: [`\n85\n | \n85`, `\n85\n | \n76`, `\n85\n | \n68`,`\n85\n | \n59`, `\n85\n | \n50`, `\n85\n | \n41`, `\n85\n | \n33`, `\n85\n | \n24`, `\n85\n | \n15`], 
          required: true
        },
        {
          prompt: SVO_prompt, 
          name: 'SVO_2', 
          labels: [`\n85\n | \n15`, `\n87\n | \n19`,`\n89\n | \n24`, `\n91\n | \n28`, `\n93\n | \n33`, `\n94\n | \n37`, `\n96\n | \n41`, `\n98\n | \n46`, `\n100\n | \n50`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_3', 
          labels: [`\n50\n | \n100`, `\n54\n | \n98`,`\n59\n | \n96`, `\n63\n | \n94`, `\n68\n | \n93`, `\n72\n | \n91`, `\n76\n | \n89`, `\n81\n | \n87`, `\n85\n | \n85`], 
          required: true
        }, 
      ],
      preamble: "For each task, click on the option you prefer.", 
    };

    var SVO_trial_likert2 = {
      type: jsPsychSVOSurveyLikert,
      questions:[
        {
          prompt: SVO_prompt, 
          name: 'SVO_4', 
          labels: [`\n50\n | \n100`, `\n54\n | \n89`,`\n59\n | \n79`, `\n63\n | \n68`, `\n68\n | \n58`, `\n72\n | \n47`, `\n76\n | \n36`, `\n81\n | \n26`, `\n85\n | \n15`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_5', 
          labels: [`\n100\n | \n50`, `\n94\n | \n56`,`\n88\n | \n63`, `\n81\n | \n69`, `\n75\n | \n75`, `\n69\n | \n81`, `\n63\n | \n88`, `\n56\n | \n94`, `\n50\n | \n100`], 
          required: true
        }, {
          prompt: SVO_prompt, 
          name: 'SVO_6', 
          labels: [`\n100\n | \n50`, `\n98\n | \n54`,`\n96\n | \n59`, `\n94\n | \n63`, `\n93\n | \n68`, `\n91\n | \n72`, `\n89\n | \n76`, `\n87\n | \n81`, `\n85\n | \n85`], 
          required: true
        },
      ],
      preamble: "For each task, click on the option you prefer.", 
    };


///////////////////////////////////////////////////////////////////////////////////////////////////
//Social Norm Espousal/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

       // Define the Likert scale labels
   var SNE_scale_labels = [
     "1 <br> Extremely uncharacteristic",
     "2 <br> Somewhat uncharacteristic ",
     "3 <br> Uncertain",
     "4 <br> Somewhat characteristic",
     "5 <br> Extremely characteristic"
   ];

   var SNE_pageone = {
    type: jsPsychSurveyLikert,
    preamble: "In this first task, please rate the extent to which the statements below are characteristic of you or what you believe. There are no right or wrong answers.",
    questions: [
      {prompt: "I go out of my way to follow social norms.", name: 'SNE1', labels: SNE_scale_labels},
      {prompt: "We shouldn't always have to follow a set of social rules.", name: 'SNE2', labels: SNE_scale_labels},
      {prompt: "People should always be able to behave as they wish rather than trying to fit the norm.", name: 'SNE3', labels: SNE_scale_labels},
      {prompt: "There is a correct way to behave in every situation.", name: 'SNE4', labels: SNE_scale_labels},
      ],
    randomize_question_order: false
  };

  var SNE_pagetwo= {
    type: jsPsychSurveyLikert,
    preamble: "Please rate the extent to which the statements below are characteristic of you or what you believe. There are no right or wrong answers.",
    questions: [
      {prompt: "If more people followed society's rules, the world would be a better place.", name: 'SNE5', labels: SNE_scale_labels},
      {prompt: "People need to follow life's unwritten rules every bit as strictly as they follow the written rules.", name: 'SNE6', labels: SNE_scale_labels},
      {prompt: "There are lots of vital customs that people should follow as members of society.", name: 'SNE7', labels: SNE_scale_labels},
    ],
    randomize_question_order: false
  };


  var SNE_pagethree = {
    type: jsPsychSurveyLikert,
    preamble: "Please rate the extent to which the statements below are characteristic of you or what you believe. There are no right or wrong answers.",
    questions: [
      {prompt: "The standards that society expects us to meet are far too restrictive.", name: 'SNE8', labels: SNE_scale_labels},
      {prompt: "People who do what society expects of them lead happier lieves.", name: 'SNE9', labels: SNE_scale_labels},
      {prompt: "Our society is built on unwritten rules that members need to follow.", name: 'SNE10', labels: SNE_scale_labels},
      {prompt: "I am at ease only when everyone around me is adhering to society's norms.", name: 'SNE11', labels: SNE_scale_labels},
    ],
    randomize_question_order: false
  };


  var SNE_pagefour = {
    type: jsPsychSurveyLikert,
    preamble: "Please rate the extent to which the statements below are characteristic of you or what you believe. There are no right or wrong answers.",
    questions: [
      {prompt: "We would be happier if we didn't try to follow society's norms.", name: 'SNE12', labels: SNE_scale_labels},
      {prompt: "My idea of a perfect world would be one with few social expectations.", name: 'SNE13', labels: SNE_scale_labels},
      {prompt: "I always do my best to follow society's rules.", name: 'SNE14', labels: SNE_scale_labels},
    ],
    randomize_question_order: false
  };



////////////////////////////////////////////////////////////////////////////////////////
//BALLS//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////



const ballintro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <p>
          In the next part of this study, you will decide how to allocate 50 balls between two buckets. 
          <br>You will see one ball in each round of the task.
          <br><br>
          Your task is to put each of the balls, one-by-one, into one of the two buckets: 
          <br>the Bucket F (left side of the screen) or the Bucket J (right side of the screen). 
          <br><br>
          The balls will appear in the center your screen in random order, indicated by a number. It can be any number up to 99.
          <br>You can allocate each ball to the bucket of your choice by pressing the corresponding <b>buttons on your keyboard: 
          <br>F for the Bucket F (left) and J for the Bucket J (right) </b>.
          <br><br>
          You will learn how much you can earn by putting the ball into Bucket F or Bucket J. 
          <br>On the left and right of the screen, next to the labels F and J, numbers will indicate how much placing a ball in the corresponding bucket will pay.
          <br><br>
          The rule in which bucket to put the ball (Bucket F or Bucket J) will be displayed.
          <br><br>
          Your earnings from this part will be based on your decisions: it is the sum of earnings from the F and J buckets.
          <br><br>Press 'Next' to proceed to some questions testing your understanding of these instructions.
      </p>
  `,
  choices: ['Next'],
}

const ballcheck1 = {
type: jsPsychHtmlButtonResponse,
stimulus: `
  <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
      <div style="font-size: 20px;">How much would you earn by placing the ball 99 into bucket J?</div> <!-- Question -->
      
      <!-- Conditional Placement: Ball on top or bottom -->
      ${participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                  <div style="font-size: 10px;">99</div> <!-- Dynamic ball number -->
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                  <div style="font-size: 10px;">F</div> <!-- Dynamic rule -->
              </div>
          </div>
      `}
      
      <!-- Middle Section (Table) -->
      <div style="width: 50%; display: table; table-layout: fixed;">
          <div style="display: table-row; height: 150px;">
              <!-- Column for F -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket F</div>
                  </div>
              </div>
              <!-- Column for F -->
              <div style="display: table-cell; text-align: left; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1000</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket J</div>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Conditional Placement: Rule on top or bottom -->
      ${!participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh !important;">99</div> <!-- Dynamic ball number -->
                  <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh;">F</div> <!-- Dynamic rule -->
                  <div style="font-size: 10px; font-weight: bold;">Rule</div>
              </div>
          </div>
      `}
  </div>
`,
choices: ['1000', '99', '1'], 
data: {
  name: 'ballcheck1' 
},
}

const feedback_ballcheck1 = {
type: jsPsychHtmlButtonResponse,
stimulus: `
  <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
      <div style="font-size: 20px;">In this example, by placing the ball 99 into bucket J, you would earn 1000.</div> <!-- Question -->
      
      <!-- Conditional Placement: Ball on top or bottom -->
      ${participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                  <div style="font-size: 10px;">99</div> <!-- Dynamic ball number -->
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                  <div style="font-size: 10px;">F</div> <!-- Dynamic rule -->
              </div>
          </div>
      `}
      
      <!-- Middle Section (Table) -->
      <div style="width: 50%; display: table; table-layout: fixed;">
          <div style="display: table-row; height: 150px;">
              <!-- Column for F -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket F</div>
                  </div>
              </div>
              <!-- Column for F -->
              <div style="display: table-cell; text-align: left; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1000</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket J</div>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Conditional Placement: Rule on top or bottom -->
      ${!participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh !important;">99</div> <!-- Dynamic ball number -->
                  <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh;">F</div> <!-- Dynamic rule -->
                  <div style="font-size: 10px; font-weight: bold;">Rule</div>
              </div>
          </div>
      `}
  </div>
`,
choices: ['OK I understand'], 
}


const ballcheck2 = {
type: jsPsychHtmlButtonResponse,
stimulus: `
  <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
      <div style="font-size: 20px;">Please complete the sentence below by clicking on the correct button.</div> <!-- Question -->
      
      <!-- Conditional Placement: Ball on top or bottom -->
      ${participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                  <div style="font-size: 10px;">99</div> <!-- Dynamic ball number -->
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                  <div style="font-size: 10px;">F</div> <!-- Dynamic rule -->
              </div>
          </div>
      `}
      
      <!-- Middle Section (Table) -->
      <div style="width: 50%; display: table; table-layout: fixed;">
          <div style="display: table-row; height: 150px;">
              <!-- Column for F -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket F</div>
                  </div>
              </div>
              <!-- Column for F -->
              <div style="display: table-cell; text-align: left; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1000</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket J</div>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Conditional Placement: Rule on top or bottom -->
      ${!participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh !important;">99</div> <!-- Dynamic ball number -->
                  <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh;">F</div> <!-- Dynamic rule -->
                  <div style="font-size: 10px; font-weight: bold;">Rule</div>
              </div>
          </div>
      `}
      
      <div style="font-size: 20px;">The rule is to put the ball in bucket ______ .</div> <!-- Question -->
  </div>
`,
choices: ['F', 'J'], 
data: {
  name: 'ballcheck2' 
},
}



const feedback_ballcheck2 = {
type: jsPsychHtmlButtonResponse,
stimulus: `
  <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
      <div style="font-size: 20px;">In this example, the rule is to put the ball in Bucket F.</div> <!-- Question -->
      
      <!-- Conditional Placement: Ball on top or bottom -->
      ${participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                  <div style="font-size: 10px;">99</div> <!-- Dynamic ball number -->
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                  <div style="font-size: 10px;">F</div> <!-- Dynamic rule -->
              </div>
          </div>
      `}
      
      <!-- Middle Section (Table) -->
      <div style="width: 50%; display: table; table-layout: fixed;">
          <div style="display: table-row; height: 150px;">
              <!-- Column for F -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket F</div>
                  </div>
              </div>
              <!-- Column for F -->
              <div style="display: table-cell; text-align: left; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px;">1000</div>
                  </div>
              </div>
              <!-- Column for J -->
              <div style="display: table-cell; text-align: center; vertical-align: middle; border: none;">
                  <div>
                      <div style="font-size: 10px; font-weight: bold;">Bucket J</div>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Conditional Placement: Rule on top or bottom -->
      ${!participant_ball_order ? `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh !important;">99</div> <!-- Dynamic ball number -->
                  <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
              </div>
          </div>
      ` : `
          <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
              <div style="border: none; padding: 10px; text-align: center;">
                  <div style="font-size: 10px; margin-bottom: 10vh;">F</div> <!-- Dynamic rule -->
                  <div style="font-size: 10px; font-weight: bold;">Rule</div>
              </div>
          </div>
      `}
  </div>
`,
choices: ['OK I understand'], 
}


///////
/////// PRACTICE TRIALS
///////

// BUTTON REMINDERS
var ballintro2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div style="width: 80%; margin: auto;">
  <p> Let's practice the task. Please keep your head still. <br/>
 <br/>
  Before each round, a "+" will appear on the screen. Look at it until it goes away.  <br/><br/>
  
  Press <b><font color='magenta'>F key</font></b> on keyboard to choose <b><font color='magenta'>Bucket F</font></b>.
 <br>
 Press <b><font color='magenta'>J key </font></b> on keyboard to choose <b><font color='magenta'>Bucket J</font></b>.
             <br><br/></p>

  <p> Press <b>SPACE</b> for three example tasks!</p></div>
  `,
  choices: [' ']
};



// SHUFFLE EXAMPLE DATA TO SHOW IN RANDOM ORDER
ball_data = jsPsych.randomization.shuffle(ball_data);
console.log(ball_data)

// START PRACTICE TRIALS (show 3)
var ball_prac_choice_count = 0;
var ball_prac_choice = {
  timeline: [
  fixation,
    {
      type: jsPsychBinaryChoiceTableFourBall,
      stimulus: () => ball_data[ball_prac_choice_count],
      choices: ["F", "J"],
      realOrPrac: false,
      participant_ball_order: participant_ball_order, 
      on_finish: () => ball_prac_choice_count++,
      extensions: [
    {type: jsPsychExtensionWebgazer, params: {targets: ['#up-left', '#bottom-right']}}  
  ]
    }
  ],
  loop_function: () => ball_prac_choice_count < 3,
};



    ///////
    /////// START MAIN DECISION PHASE
    ///////

    var EnterRealChoice = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div> Now it's time for the real decisions. <br></br>
      Press <b>SPACE</b> to begin!</div>`,
      choices: [' '],
      post_trial_gap: 500,
  }


    // RUN CALIBRATION PROCEDURE BEFORE TRIALS 0, 12, 24, 36, 48 
    var ball_if_node1 = {
      timeline: [cali_vali_instructions ,fixation_cali, fixation1],
      conditional_function: function(){
          if(ball_real_choice_counts == 0 || ball_real_choice_counts == 12 || ball_real_choice_counts == 24 || ball_real_choice_counts == 36 || ball_real_choice_counts == 48){
              return true;
          } else {
              return false;
          }
      }
    }
    
  // RUN FIXATION CROSS FOR TRIALS THAT ARE NOT 0, 12, 24, 36, 48 
  var ball_if_node2 = {
    timeline: [fixation],
    conditional_function: function(){
        if(ball_real_choice_counts != 0 && ball_real_choice_counts != 12 && ball_real_choice_counts != 24  && ball_real_choice_counts != 36 && ball_real_choice_counts != 48 ){
            return true;
        } else {
            return false;
        }
    }
  }

  // SHUFFLE STIMULI
  var ball_data_b1 = jsPsych.randomization.shuffle(ball_data_r1);

  // SET TRIAL COUNT TO 0
  var ball_real_choice_counts = 0;

  // RUN DECISION TRIALS 
  var ball_real_choice = {
    timeline: [
      ball_if_node1,
      ball_if_node2,
      {
        type: jsPsychBinaryChoiceTableFourBall,
        stimulus: () => ball_data_b1[ball_real_choice_counts%10],
        choices: ["F", "J"],
        realOrPrac: true,
        participant_ball_order: participant_ball_order, 
        on_start: function(trial) {
          document.body.classList.add('no-scroll');
        },
        on_finish: function(trial) {
          ball_real_choice_counts++;
          document.body.classList.remove('no-scroll');
        },
        extensions: [
          {
            type: jsPsychExtensionWebgazer,
            params: {targets: ['#up-left', '#bottom-right']}
          }  
        ]
      }
    ],
    loop_function: () => ball_real_choice_counts < 5, // set number of trials here
  };

  var donecursor = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: ` <p>Done! You can move around freely again. The webcam will not track your gaze anymore.</p>
      <p>Press SPACE to move on.</p>
    `,
    choices: [' '],
    on_load: function () {
      document.body.style.cursor = 'auto';
    }
  };


///////////////////////////////////////////////////////////////////////////////////////////////////
//Dictator Game/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


var choice_instructions1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="width: 80%; margin: auto;">
  <p> In the next task, you will decide to give points to yourself and other participants in this study in multiple rounds. </p>
  For each decision, another participant is randomly matched with you. For each option, you will see <b>how many points you get</b>, and <b>how many points the other participant gets</b>. </p>
  <p> Each time, you have two options: Option F (on the left) and Option J (on the right). </p>

  Press <b><font color='magenta'>F</font></b> to choose <b><font color='magenta'>Option F</font></b> (the option on the left).
  <br>
  Press <b><font color='magenta'>J</font></b> to choose <b><font color='magenta'>Option J</font></b> (the option on the right).
  <p>
  <b>      
  </b>
  </p>
  <p> How much money you earn depends on your own or someone else's decisions. A coin toss will decide what will happen: </br>
  one of your own decisions is randomly chosen to be paid out to you and the other player. </br>
  OR </br>
  someone else's decision is randomly chosen to be paid out, and you receive what they decided. </p></br>
  <p> 100 points are worth 0.37$ (about 21 Peso). Each decision you make has the same chance to be picked to be paid out.<p/> 

  <p>Press <b>SPACE</b> to continue!</p>
  </div>
  `,
  choices: [' ']
};

var choice_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    return ` <p> In each round, you will also see two additional pieces of information:</p>
        <p> <b>Rule</b>    and    <b>Other's Random Number</b>. </br></br> </p>
        <p> <b>Rule</b>: This information tells you to choose Option F (left) or Option J (right).</br>
        <p> <b>Other's Random Number</b>: This information tells you a random number that belongs to the other participant. It can be any number up to 99. </br>
        Every person gets a random number in this study.</p>
        <p>Press <b>SPACE</b> to see an example!</p>  
      `;

  },
  choices: [' '],
};

var imgSrc;
var choice_instructions3 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    if (participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
      imgSrc = "../img/comp_checkG_YouTop_GroupTop0.png";
    } else if (!participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupBottom0.png";
    } else if (participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "0") {
      imgSrc = "../img/comp_checkG_YouTop_GroupBottom0.png";
    } else if (!participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "0") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupTop0.png";
    } 
    else if (participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
      imgSrc = "../img/comp_checkG_YouTop_GroupTop1.png";
    } else if (!participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupBottom1.png";
    } else if (participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "1") {
      imgSrc = "../img/comp_checkG_YouTop_GroupBottom1.png";
    } else if (!participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "1") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupTop1.png";
    }  
    else if (participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
      imgSrc = "../img/comp_checkG_YouTop_GroupTop2.png";
    } else if (!participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupBottom2.png";
    } else if (participant_payoff_order && !participant_otherinfo_order && participant_LMR_order === "2") {
      imgSrc = "../img/comp_checkG_YouTop_GroupBottom2.png";
    } else if (!participant_payoff_order && participant_otherinfo_order && participant_LMR_order === "2") {
      imgSrc = "../img/comp_checkG_YouBottom_GroupTop2.png";
    }  
    return `<div style="width: 80%; margin: auto; text-align: center;">
  <p>Here is an example of how the decision tasks will look. </br> </p>
  <img height="600px" src="${imgSrc}"><br/>
  <p> Each box shows you information about the decision:
  <div style="width: 80%; margin: auto; text-align:left;">
  <ul>
  <li>How many points you get if you choose Option F (left) or J (right).</li>
  <li>How many points the other person get if you choose Option F(left) or J (right).</li> 
  <li>If rule is to choose F(left) or J (right). </li>
  <li>What random number the other person has.</li>
  </ul></p> 
  </div> </br> </br>

  Press <b>SPACE</b> to continue!</p>
  </div>
  `;
  },
  choices: [' ']
};

stimuli_data = jsPsych.randomization.shuffle(stimuli_data);
console.log(stimuli_data);

stimuli_data_r1 = jsPsych.randomization.shuffle(stimuli_data_r1);



// QUESTION 1
var comprehension_check1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `<div style="max-width: 80%; margin:auto; text-align: center;"> 
       
      <img height="600px" src="${imgSrc}"><br/>
      <br>
      </div>
      <p>Imagine you choose Option F (left). </br>
      How many points will the <b>other person</b> get? Click on the answer!</p>
      `
  }, 
  choices: ['59', '56', '22', '15'],
  required: true,
  data: {
    name: 'comprehension_check1'
  }
};


// FEEDBACK 1
var comprehension_feedback1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `<div style="max-width: 80%; margin:auto;  text-align: center;"> 
       
      <img height="600px" src="${imgSrc}"><br/>
      <br>
      </div>
      <p>In this example, if you choose Option F (left), the <b> other person </b> gets 59 points.</p>
      `},  
    choices: ['OK I understand'], 
    required: true, 
};

// QUESTION 2
var comprehension_check2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `<div style="max-width: 80%; margin:auto; text-align: center;"> 
       
      <img height="600px" src="${imgSrc}"><br/>
      <br>
      </div>
      <p>Look at this example again.<br>

      What option does the <b>rule</b> indicate? Click on the answer!</p>`
    },
    choices: ['F', 'J'], 
    required: true,
    data: {
      name: 'comprehension_check2'
    }
};

// FEEDBACK 2

var comprehension_feedback2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `
    <div style="max-width: 80%; margin:auto;  text-align: center;"> 
       
    <img height="600px" src="${imgSrc}"><br/>
    <br>
    </div>
    <p>In this example, the rule is to choose <b>Bucket F</b>. You can tell because there is an <b>F</b> shown.</p>
    <p>When the rule is to choose <b>Bucket J</b>, there is a <b>J</b> shown.</p>`;
    }, 
  choices: ['OK I understand'],
  required: true
};


// QUESTION 3
var comprehension_check3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `<div style="max-width: 80%; margin:auto; text-align: center;"> 
       
      <img height="600px" src="${imgSrc}"><br/>
      <br>
      </div>
      <p>Last question about this example:.<br>

      If you choose Option J, how many points do <b>you get</b>? Click on the answer!</p>`
    }, 
    choices: ['59', '56', '22', '15'],
    required: true,
    data: {
      name: 'comprehension_check3'
    }
};

// FEEDBACK 3
var comprehension_feedback3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `<div style="max-width: 80%; margin:auto;  text-align: center;"> 
       
      <img height="600px" src="${imgSrc}"><br/>
      <br>
      </div>
      <p>In this example, if you choose Option J (right), <b> you </b> get 15 points.</p> 
      `}, 
    name: 'comp_check_ownreceive', 
    choices: ['OK I understand'], 
    required: true
};



///////
/////// PRACTICE TRIALS
///////

// BUTTON REMINDERS
var task_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div style="width: 80%; margin: auto;">
  <p> Let's practice the task. Please keep your head still. <br/>
 <br/>
  Before each round, a "+" will appear on the screen. Look at it until it goes away.  <br/><br/>
  
  Press <b><font color='magenta'>F key</font></b> on keyboard to choose <b><font color='magenta'>Option F</font></b>.
 <br>
 Press <b><font color='magenta'>J key </font></b> on keyboard to choose <b><font color='magenta'>Option J</font></b>.
             <br><br/></p>

  <p> Press <b>SPACE</b> for three example tasks!</p></div>
  `,
  choices: [' '],
  post_trial_gap: 1000
};

// SHUFFLE EXAMPLE DATA TO SHOW IN RANDOM ORDER
stimuli_data = jsPsych.randomization.shuffle(stimuli_data);

// START PRACTICE TRIALS (show 3)
var charity_prac_choice_count = 0;
var charity_prac_choice = {
  timeline: [
  fixation,
    {
      type: jsPsychBinaryChoiceTableFour,
      stimulus: () => stimuli_data[charity_prac_choice_count],
      choices: ["F", "J"],
      realOrPrac: false,
      payoffYouTop: participant_payoff_order, 
      payoffRuleTop: participant_otherinfo_order, 
      payoffLMR: participant_LMR_order,
      on_finish: () => charity_prac_choice_count++,
      extensions: [
    {type: jsPsychExtensionWebgazer, params: {targets: ['#up-left', '#bottom-right']}}  
  ]
    }
  ],
  loop_function: () => charity_prac_choice_count < 3,
};


    ///////
    /////// START MAIN DECISION PHASE
    ///////



    // RUN CALIBRATION PROCEDURE BEFORE TRIALS 0, 12, 24, 36, 48 
    var if_node1 = {
        timeline: [cali_vali_instructions ,fixation_cali, fixation1],
        conditional_function: function(){
            if(real_choice_counts == 0 || real_choice_counts == 12 || real_choice_counts == 24 || real_choice_counts == 36 || real_choice_counts == 48){
                return true;
            } else {
                return false;
            }
        }
      }
      
    // RUN FIXATION CROSS FOR TRIALS THAT ARE NOT 0, 12, 24, 36, 48 
    var if_node2 = {
      timeline: [fixation],
      conditional_function: function(){
          if(real_choice_counts != 0 && real_choice_counts != 12 && real_choice_counts != 24  && real_choice_counts != 36 && real_choice_counts != 48 ){
              return true;
          } else {
              return false;
          }
      }
    }

    // SHUFFLE STIMULI
    var stimuli_data_b1 = jsPsych.randomization.shuffle(stimuli_data_r1);
  
    // SET TRIAL COUNT TO 0
    var real_choice_counts = 0;
  
    // RUN DECISION TRIALS 
    var real_choice = {
      timeline: [
        if_node1,
        if_node2,
        {
          type: jsPsychBinaryChoiceTableFour,
          stimulus: () => stimuli_data_b1[real_choice_counts%10],
          choices: ["F", "J"],
          realOrPrac: true,
          payoffYouTop: participant_payoff_order,
          payoffRuleTop: participant_otherinfo_order, 
          payoffLMR: participant_LMR_order,
          on_start: function(trial) {
            document.body.classList.add('no-scroll');
          },
          on_finish: function(trial) {
            real_choice_counts++;
            document.body.classList.remove('no-scroll');
          },
          extensions: [
            {
              type: jsPsychExtensionWebgazer,
              params: {targets: ['#up-left', '#bottom-right']}
            }  
          ]
        }
      ],
      loop_function: () => real_choice_counts < 5, // set number of trials here
    };



///////////////////////////////////////////////////////////////////////////////////////////////////
//Explicit Preferences/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

         /* check if participants want to see */
         var lookcheck_trial = {
          type: jsPsychHtmlButtonResponse,
          stimulus: function() {
            return `
             <p>In the next task, you have 100 points that are worth 0.37$ (about 21 Peso).</p> 
             <p>You can keep these points to yourself, or you can give some or all of the points to another participant in this study. </p>
             <p>There is either a rule that you should keep the 100 points to yourself or that you should give some of the points to the other participant.</p>
             <p><strong>Would you like to know what the rule is?</strong></p>`;
            },
            choices: ['YES, I want to know the rule!','NO, I do not want to know the rule.'],
            required: true,
            data: {
              name: 'lookcheck_trial' 
            }
          };
    
          var lookcheck_trial_KEEP = {
            type: jsPsychSurveyText,
            questions: [
            {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , 
              required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_trial_KEEP'}, 
            ], 
            preamble: `
            <div style="color: magenta;">The rule is to keep the 100 points to yourself.</div>
            <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
          };
    
          var lookcheck_trial_SHARE = {
            type: jsPsychSurveyText,
            questions: [
            {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , 
              required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_trial_SHARE'}, 
            ], 
            preamble: `
            <div style="color: magenta;">The rule is to give some of the 100 points to the other participant.</div>
            <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
          };
      
        var lookcheck_trial_NONE = {
            type: jsPsychSurveyText,
            questions: [
            {prompt: "How many points do you give to the other participant?", rows: 2, columns:50 , 
              required:true, placeholder: 'Enter a number between 0 and 100', name:'lookcheck_trial_NONE'}, 
            ], 
            preamble: `
            <div style="color: magenta;">We won't tell you what the rule is.</div>
            <div>You have 100 points. Decide how much to give to the other participant. You will keep the rest for yourself. </div>`,
          };
    
    
        // Randomly select one of the trials
        var lookcheck_trials = [lookcheck_trial_KEEP, lookcheck_trial_SHARE, lookcheck_trial_NONE];
        var selected_lookcheck = jsPsych.randomization.sampleWithoutReplacement(lookcheck_trials, 1)[0];
    
   
///////////////////////////////////////////////////////////////////////////////////////////////////
//Final Check/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var visioncheck_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>Did you wear glasses during the study?  </br> </br> It is very important that you answer honestly. There are no repercussions if you did wear glasses. We just need to know for the data analysis. </br> </br> Click on your answer!</p>',
  choices: ['YES', 'NO'],
  required: true,
  data: {
    trial_name: 'visioncheck' 
  }
};

var eslcheck_trial = {
type: jsPsychHtmlButtonResponse,
stimulus: '<p>Is English your native language?  </br> </br> Click on your answer!</p>',
choices: ['YES', 'NO'],
required: true,
data: {
  trial_name: 'eslcheck_trial' 
}
};

var country_survey_trial = {
type: jsPsychSurveyText,
questions: [
{prompt: "In which country have you spent the most time before you turned 18?", rows: 2, columns:50 , required:true, name:'country18'}, 
{prompt: "In which country do you currently live?", rows: 2, columns: 50, required:true, name:'countrynow'},
], 
preamble: `<div>Please answer the following questions: </div>`,
};

const demographics = {
type: jsPsychSurveyHtmlForm,
preamble: '<p>Please answer the following questions about yourself:</b></p>',
html: `
    <p> 
        Age in years: <input name="age" type="number" required /><br>
        Gender: <input name="gender" type="text" required />
    </p>
`,
button_label: ['Next'],
data: {
  trial_name: 'demographics'
}
}



  var trafficlight_labels = [
    "0 <br> Extremely <b>unlikely</b> that I would wait for the light to turn green.",
    "1",
    "2",
    "3",
    "4",
    "5 <br> Uncertain",
    "6",
    "7",
    "8",  
    "9",
    "10 <br> Extremely <b>likely</b> that I would wait for the light to turn green."
  ];

  var trafficlight_trial = {
    type: jsPsychSurveyLikert,
    preamble: "Please respond honestly to the question below.",
    questions: [
      {prompt: "Imagine you are standing at a traffic light on foot.<br>The light is red.<br>There is no-one around.<br><b>How likely is it that you would wait for the light to turn green before you cross the street?</b>", 
       name: 'trafficlight', 
       labels: trafficlight_labels},
    ],
    randomize_question_order: false
 };
 


//////////////////////////////////////////////////////////////////////////////////////////////////
//Cleanup/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


var feedback = {
  type: jsPsychSurveyText,
  name: 'feedback',
  questions: [
    {prompt: "Do you have any feedback for us?", rows: 5, columns:100 , required:false} 
    ],
  preamble: `<div style="max-width: 1000px;"> You have come to the end of our study.
  We thank you very much for your participation! <br>
  At this point, we would like if you have any feedback about this study. 
  If you do, please enter it in the box below. If you do not have any feedback, leave the box empty and click on <b>Next</b>.
   </div>`,
   button_label: 'Next',  
  on_load: function () {
    document.body.style.cursor = 'auto'
  }
};


    var success_guard = {
        type: jsPsychCallFunction,
        func: () => {successExp = true}
    };

    var on_finish_callback = function () {
        // jsPsych.data.displayData();
        jsPsych.data.addProperties({
            browser_name: bowser.name,
            browser_type: bowser.version,
            subject: subject_id,
            payoff_order: participant_payoff_order,
            otherplayer_order: participant_otherinfo_order,
            rule_order: participant_ball_order,
            interaction: jsPsych.data.getInteractionData().json(),
            windowWidth: screen.width,
            windowHeight: screen.height
        });
        var data = JSON.stringify(jsPsych.data.get().values());
        $.ajax({
             type: "POST",
             url: "/data",
             data: data,
             contentType: "application/json"
           })
           .done(function () {
            ("This is the end of the experiment. Thanks for taking part!" +
            "Your completion code is: <b> 189273 </b>." +
            "The webcam will turn off when you close the browser. You can close the browser when you have copied your completion code." +
            "Our goal was to study which information people take into consideration when they decide about conforming to rules in different context.")
           })
           .fail(function () {
             ("A problem occured while saving the data." +
             "Please save the data to your computer and send it to the experimenter via email: rahal@coll.mpg.de.") ;
             var failsavecsv = jsPsych.data.get().cvs();
             var failsavefilename = jsPsych.data.get().values()[0].subject_id+".csv";
             downloadCSV(csv,failsavefilename);
        })
    }

    function startExp(){
        var timeline = [];
        timeline.push(preload);
        timeline.push(start_exp_survey_trial);
        timeline.push(fullscreenEnter);

        // Screening questions
        timeline.push(glasses_screening);

          // social norm espousal
        timeline.push(SNE_pageone);
        timeline.push(SNE_pagetwo);
        timeline.push(SNE_pagethree);
        timeline.push(SNE_pagefour);

        // SVO
        timeline.push(SVO_instruction);
        timeline.push(SVO_trial_likert1);
        timeline.push(SVO_trial_likert2);

        // balls
        timeline.push(ballintro);

        timeline.push({
            timeline: [ballcheck1],
            on_finish: function(data) {
                jsPsych.data.addProperties({ ballcheck1_response: data.response}); // Log response
            }
        });
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                // Retrieve the response from the previous trial
                const response = jsPsych.data.get().last(1).values()[0].ballcheck1_response;
                
                // Change the displayed text based on the response
                if (response === 0) {
                    return `<p>You selected the correct response: 1000!
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 1) {
                    return `<p>You selected 99. That was not the right answer. 
                        <br><br> You indicated the random number assosciated with the ball. 
                        <br> The payment assosciated with option J is displayed directly next to the letter J on the right of the screen. 
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 2) {
                    return `<p>You selected 1. That was not the right answer.
                            <br><br> You indicated the payment for putting the ball in bucket F.
                            <br> The payment assosciated with option J is displayed directly next to the letter J on the right of the screen. 
                            <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else {
                    return `<p>Invalid response. Please try again.</p>`;
                }
            },
            choices: ['Next'], // Just a button to proceed
        });
        timeline.push(feedback_ballcheck1);
        timeline.push({
            timeline: [ballcheck2],
            on_finish: function(data) {
                jsPsych.data.addProperties({ ballcheck2_response: data.response}); // Log response
            }
        });
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                // Retrieve the response from the previous trial
                const response = jsPsych.data.get().last(1).values()[0].ballcheck2_response;
                
                // Change the displayed text based on the response
                if (response === 0) {
                    return `<p>You selected the correct response: F!
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 1) {
                    return `<p>You selected J. That was not the right answer. 
                        <br><br> The rule is displayed in the center of the screen and indicates if you should put the ball in bucket F or J.  
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else {
                    return `<p>Invalid response. Please try again.</p>`;
                }
            },
            choices: ['Next'], // Just a button to proceed
        });
        timeline.push(feedback_ballcheck2);
// BALL GAME
        timeline.push(calibration_instructions);
        timeline.push(init_camera);
        timeline.push(calibration);
        timeline.push(validation_instructions);
        timeline.push(validation);
        timeline.push(recalibrate);
        timeline.push(ballintro2);
        timeline.push(ball_prac_choice);
        timeline.push(EnterRealChoice);
        timeline.push(ball_real_choice);
        timeline.push(donecursor);


      // Dictator game
        timeline.push(choice_instructions1);
        timeline.push(choice_instructions2);
        timeline.push(choice_instructions3);

        timeline.push({
            timeline: [comprehension_check1],
            on_finish: function(data) {
                jsPsych.data.addProperties({ comprehension_check1_response: data.response}); // Log response
            }
        });

        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                // Retrieve the response from the previous trial
                const response = jsPsych.data.get().last(1).values()[0].comprehension_check1_response;
                
                // Change the displayed text based on the response
                if (response === 0) {
                    return `<p>You selected the correct response: 59!
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 1) {
                    return `<p>You selected 56. That was not the right answer. 
                        <br><br> You indicated the points the other person gets if you chose Option J. We were looking for what they get if you chose Option F.
                        <br> The points for the other person when you choose Option F are displayed in the box that says "Option F: Other gets". 
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 2) {
                    return `<p>You selected 22. That was not the right answer.
                            <br><br> You indicated the points you would get if you chose Option F. We were looking for what the other person would get.
                            <br> The points for the other person when you choose Option F are displayed in the box that says "Option F: Other gets".
                            <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 3) {
                    return `<p>You selected 15. That was not the right answer.
                            <br><br> You indicated the points you get if you chose Option J. We were looking for what the other player would get if you chose Option F.
                            <br> The points for the other person when you choose Option F are displayed in the box that says "Option F: Other gets".
                            <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else {
                    return `<p>Invalid response. Please try again.</p>`;
                }
            },
            choices: ['Next'], // Just a button to proceed
        });
        timeline.push(comprehension_feedback1);
        timeline.push({
            timeline: [comprehension_check2],
            on_finish: function(data) {
                jsPsych.data.addProperties({ comprehension_check2_response: data.response}); // Log response
            }
        });

        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                // Retrieve the response from the previous trial
                const response = jsPsych.data.get().last(1).values()[0].comprehension_check2_response;
                
                // Change the displayed text based on the response
                if (response === 0) {
                    return `<p>You selected the correct response: F!
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 1) {
                    return `<p>You selected J. That was not the right answer. 
                        <br><br> You indicated that the rule points to Option J. It actually points to Option F.
                        <br> The rule is displayed in the box with the titel "Rule" and indicates if you should choose option F or J. 
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                 } else {
                    return `<p>Invalid response. Please try again.</p>`;
                }
            },
            choices: ['Next'], // Just a button to proceed
        });
        timeline.push(comprehension_feedback2);
        timeline.push({
            timeline: [comprehension_check3],
            on_finish: function(data) {
                jsPsych.data.addProperties({ comprehension_check3_response: data.response}); // Log response
            }
        });

        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
                // Retrieve the response from the previous trial
                const response = jsPsych.data.get().last(1).values()[0].comprehension_check3_response;
                
                // Change the displayed text based on the response
                if (response === 0) {
                    return `<p>You selected the correct response: 59! That was not the right answer. 
                        <br><br> You indicated the points you would get if you chose Option F. We were looking for what you get if you chose Option J.
                        <br> The points you get when you choose Option J are displayed in the box that says "Option J: You get". 
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 1) {
                    return `<p>You selected 56. That was not the right answer.
                            <br><br> You indicated the points the other player would get if you chose Option J. We were looking for what you would get.
                            <br> The points you get when you choose Option J are displayed in the box that says "Option J: You get". 
                        <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 2) {
                    return `<p>You selected 22. That was not the right answer.
                            <br><br> You indicated the points you would get if you chose Option F. We were looking for what you would get if you chose Option J.
                        <br> The points you get when you choose Option J are displayed in the box that says "Option J: You get". 
                            <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else if (response === 3) {
                    return `<p>You selected the correct response:15!
                            <br><br> Please look at the example and explanation again on the next page to familiarize yourself with the display.</p>`;
                } else {
                    return `<p>Invalid response. Please try again.</p>`;
                }
            },
            choices: ['Next'], // Just a button to proceed
        });
        timeline.push(comprehension_feedback3);
// DICTATOR GAME
        timeline.push(calibration_instructions);
        timeline.push(init_camera);
        timeline.push(calibration);
        timeline.push(validation_instructions);
        timeline.push(validation);
        timeline.push(recalibrate);
        timeline.push(task_instructions);
        timeline.push(charity_prac_choice);
        timeline.push(EnterRealChoice);
        timeline.push(real_choice);
        timeline.push(donecursor);


        // lookcheck
        timeline.push(lookcheck_trial);
        timeline.push(selected_lookcheck);


        // other check
        timeline.push(visioncheck_trial);
        timeline.push(eslcheck_trial);
        timeline.push(country_survey_trial);
        timeline.push(demographics);


        // traffic light check 
       timeline.push(trafficlight_trial);


        // end
        timeline.push(feedback);
        timeline.push(success_guard);
        
        jsPsych.run(timeline);
    }
    