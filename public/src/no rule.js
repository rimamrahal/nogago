
const ballcheck3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
          <div style="font-size: 20px;">In this example, what is the rule?</div> <!-- Question -->
          
          <!-- Conditional Placement: Ball on top or bottom -->
          ${participant_ball_order ? `
              <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                      <div style="font-size: 10px;">104</div> <!-- Dynamic ball number -->
                  </div>
              </div>
          ` : `
              <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                      <div style="font-size: 10px;">0</div> <!-- Dynamic rule -->
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
                          <div style="font-size: 10px;">124</div>
                      </div>
                  </div>
                  <!-- Column for J -->
                  <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                      <div>
                          <div style="font-size: 10px;">12</div>
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
                      <div style="font-size: 10px; margin-bottom: 10vh !important;">104</div> <!-- Dynamic ball number -->
                      <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
                  </div>
              </div>
          ` : `
              <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; margin-bottom: 10vh;">0</div> <!-- Dynamic rule -->
                      <div style="font-size: 10px; font-weight: bold;">Rule</div>
                  </div>
              </div>
          `}
      
      </div>
  `,
  choices: ['Put ball in F', 'Put ball in J', 'No rule'], 
}



const feedback_ballcheck3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <div style="display: flex; flex-direction: column; align-items: center; height: 70vh; justify-content: space-between; padding: 10px 0; box-sizing: border-box;">
          <div style="font-size: 20px;">In this example, there is no rule, indicated by the 0 shown.</div> <!-- Question -->
          
          <!-- Conditional Placement: Ball on top or bottom -->
          ${participant_ball_order ? `
              <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Ball</div>
                      <div style="font-size: 10px;">104</div> <!-- Dynamic ball number -->
                  </div>
              </div>
          ` : `
              <div style="width: 50%; display: table; justify-content: center; margin-top: 5vh; border-top: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; font-weight: bold; margin-bottom: 10vh;">Rule</div>
                      <div style="font-size: 10px;">0</div> <!-- Dynamic rule -->
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
                          <div style="font-size: 10px;">124</div>
                      </div>
                  </div>
                  <!-- Column for J -->
                  <div style="display: table-cell; text-align: right; vertical-align: middle; border: none;">
                      <div>
                          <div style="font-size: 10px;">12</div>
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
                      <div style="font-size: 10px; margin-bottom: 10vh !important;">104</div> <!-- Dynamic ball number -->
                      <div style="font-size: 10px; font-weight: bold !important;">Ball</div>
                  </div>
              </div>
          ` : `
              <div style="width: 50%; display: table; justify-content: center; margin-bottom: 5vh; border-bottom: 2px solid white;">
                  <div style="border: none; padding: 10px; text-align: center;">
                      <div style="font-size: 10px; margin-bottom: 10vh;">0</div> <!-- Dynamic rule -->
                      <div style="font-size: 10px; font-weight: bold;">Rule</div>
                  </div>
              </div>
          `}
      </div>
  `,
  choices: ['OK I understand'], 
}
