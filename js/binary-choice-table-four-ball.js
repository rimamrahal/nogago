var jsPsychBinaryChoiceTableFourBall = (function (jspsych) {
  "use strict";

  const info = {
    name: "binary-choice-table-four-ball",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jspsych.ParameterType.KEYCODE,
        array: true,
        pretty_name: 'choices',
        default: ['F', 'J'], //jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      timing_response: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'timing_response',
        default: 0,
        description: 'timing_response.'
      },
      doEyeTracking: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'eye-tracking',
        default: true,
        description: 'Whether to do the eye tracking during this trial.'
      },
      payoffYouTop: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'payoff-you-top',
        default: true,
        description: 'The order of payoff values. True mean "you recieve" payoff are shown in the top row.'
      },
      realOrPrac: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'real-or-prac',
        default: true,
        description: 'Whether it is a real choice, real- true'
      }, 
            /**
       * How long to show the stimulus.
       */
      stimulus_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: "Stimulus duration",
          default: null,
      },
      /**
       * How long to show trial before it ends.
       */
      trial_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: "Trial duration",
          default: null,
      },
      /**
       * If true, trial will end when subject makes a response.
       */
      response_ends_trial: {
          type: jspsych.ParameterType.BOOL,
          pretty_name: "Response ends trial",
          default: true,
      }
      
      },
  };

  /**
   * **binary-choice-table**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author YOUR NAME
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class BinaryChoiceTableFourBallPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

      // set default values for the parameters
      trial.choices = trial.choices || [];
      //trial.timing_stim = trial.timing_stim || -1;
      trial.timing_response = trial.timing_response || -1;
      var keyboardListener;
    
      var response = {
        rt: -1,
        key: -1
      };
      console.log("in_trial: ", this);
      // this.jsPsych.extensions.webgazer.showPredictions();
      // this.jsPsych.extensions.webgazer.resume();
      
      // display stimuli

      
        // console.log('!!! display_stage');
        console.log(trial.stimulus['F'], trial.stimulus['J'],trial.stimulus['rule'], trial.stimulus['random']);
        console.log("this: ",this);

        display_element.innerHTML = '';
        // var new_html = '';

        var table_stimulus;
        

            table_stimulus = ` <div id = "balltable"; style="display: flex; flex-direction: column; align-items: center; height: 100vh; justify-content: space-between;">
                  
                      <!-- Conditional Placement: Ball on top or bottom -->
                      ${participant_ball_order ? `
                          <div style="width: 100%; display: table; justify-content: center; margin-top: 5vh;">
                              <div style="border: none; padding: 10px; text-align: center;">
                                  <div style="font-size: 10px; font-weight: bold;  margin-bottom: 10vh;">Ball</div>
                                  <div style="font-size: 10px;">${trial.stimulus['random'].toFixed(0)}</div> <!-- Dynamic ball number -->
                              </div>
                          </div>
                      ` : `
                          <div style="width: 100%; display: table; justify-content: center; margin-top: 5vh;">
                              <div style="border: none; padding: 10px; text-align: center;">
                                  <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                                  <div style="font-size: 10px;">${trial.stimulus['rule']}</div> <!-- Dynamic rule -->
                              </div>
                          </div>
                      `}
                        
                      <!-- Middle Section (Table) -->
                      <div style="width: 100%; display: table; table-layout: fixed;">
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
                                      <div style="font-size: 10px;">${trial.stimulus['F'].toFixed(0)}</div>
                                  </div>
                              </div>
                              <!-- Column for J -->
                              <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                                  <div>
                                      <div style="font-size: 10px;">${trial.stimulus['J'].toFixed(0)}</div>
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
                          <div style="width: 100%; display: table; justify-content: center; margin-bottom: 5vh;">
                              <div style="border: none; padding: 10px; text-align: center;">
                                  <div style="font-size: 10px; margin-bottom: 10vh !important;">${trial.stimulus['random'].toFixed(0)}</div> <!-- Dynamic ball number -->
                                  <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
                              </div>
                          </div>
                      ` : `
                          <div style="width: 100%; display: table; justify-content: center; margin-bottom: 5vh;">
                              <div style="border: none; padding: 10px; text-align: center;">
                                  <div style="font-size: 10px; margin-bottom: 10vh;">${trial.stimulus['rule']}</div> <!-- Dynamic rule -->
                                  <div style="font-size: 10px; font-weight: bold;">Rule</div>
                              </div>
                          </div>
                      `}
                        
                  </div>
          `;
    
        
        var new_html = '<div id="jspsych-html-keyboard-response-stimulus">' + table_stimulus + "</div>";
          
      // add prompt
      // if (trial.prompt !== null) {
      //     new_html += trial.prompt;
      // }
      // // draw
      display_element.innerHTML = new_html;
      // store response
      var response = {
          rt: null,
          key: null,
      };

      // turn on webgazer's loop
      console.log("in trial before", this);
      console.log("in trial web", this.jsPsych.extensions.webgazer.isInitialized());
     
      // function to end trial when it is time
      const end_trial = () => {
          // kill any remaining setTimeout handlers
          this.jsPsych.pluginAPI.clearAllTimeouts();
          // kill keyboard listeners
          if (typeof keyboardListener !== "undefined") {
              this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
          // gather the data to store for the trial
          // var trial_data = {
          //     rt: response.rt,
          //     stimulus: trial.stimulus,
          //     response: response.key,
          // };
          var trial_data = {
            stimulus: trial.stimulus,
            rt: response.rt,
            key_press: response.key,
            choices: trial.choices,
            realtrial:  trial.realOrPrac,
            F: trial.stimulus['F'], 
            J: trial.stimulus['J'], 
            Rule: trial.stimulus['rule'],
            Random: trial.stimulus['random']
          };
          console.log("in end binary: ", this);
  
          // clear the display
          display_element.innerHTML = "";
          // move on to the next trial
          this.jsPsych.finishTrial(trial_data);
      };
      // function to handle responses by the subject
      var after_response = (info) => {
          // after a valid response, the stimulus will have the CSS class 'responded'
          // which can be used to provide visual feedback that a response was recorded
          display_element.querySelector("#jspsych-html-keyboard-response-stimulus").className +=
              " responded";
          // only record the first response
          if (response.key == null) {
              response = info;
          }
          if (trial.response_ends_trial) {
              end_trial();
          }
      };
      // start the response listener
      if (trial.choices != "NO_KEYS") {
          var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: after_response,
              valid_responses: trial.choices,
              rt_method: "performance",
              persist: false,
              allow_held_key: false,
          });
      }
      // hide stimulus if stimulus_duration is set
      if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
              display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
          }, trial.stimulus_duration);
      }
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
      }

  

    }
  }
  BinaryChoiceTableFourBallPlugin.info = info;

  return BinaryChoiceTableFourBallPlugin;
})(jsPsychModule);

