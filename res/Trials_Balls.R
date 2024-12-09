# Load necessary library
library(dplyr)
library(ggplot2)

set.seed(220502)  # For reproducibility



# Function to generate payoffs for Type 1 trials
generate_type1 <- function() {
  diff <- sample(15:45, 1)
  A <- sample(1:99, 1)
  B <- A + diff
  if (B > 99) B <- A - diff  # Adjust B if it exceeds 100
  return(c(A, B))
}

# Function to generate payoffs for Type 2 trials
generate_type2 <- function() {
  diff <- sample(50:80, 1)  # Random difference between 50 and 80
  A <- sample(1:(99 - diff), 1)  # Ensure that A + diff does not exceed 100
  B <- A + diff
  return(c(A, B))
}

# Function to generate payoffs for Type 3 trials
generate_type3 <- function() {
  diff <- sample(1:5, 1)
  A <- sample(1:99, 1)
  B <- A + diff
  if (B > 99) B <- A - diff  # Adjust B if it exceeds 100
  return(c(A, B))
}

# Generate 16 trials of each type (1, 2, 3)
type1_trials <- replicate(16, generate_type1(), simplify = "data.frame")
type2_trials <- replicate(16, generate_type2(), simplify = "data.frame")
type3_trials <- replicate(16, generate_type3(), simplify = "data.frame")

# Combine all trials into a single dataframe
all_trials <- data.frame(
  Type = rep(1:3, each = 16),
  Payoff_A = c(type1_trials[1,], type2_trials[1,], type3_trials[1,]),
  Payoff_B = c(type1_trials[2,], type2_trials[2,], type3_trials[2,])
)

# Add 2 filler trials with equal payoffs for A and B
filler_trials <- data.frame(
  Type = rep("Filler", 2),
  Payoff_A = c(42, 58),  # Example equal payoff for filler trials
  Payoff_B = c(42, 58)
)

# Combine the trials and fillers
all_trials <- rbind(all_trials, filler_trials)

# Add columns for Rule (A or B) 
all_trials$rule <- NA
for (t in 1:3) {
  # Subset trials for each type
  type_trials <- all_trials[all_trials$Type == t, ]
  # Randomly assign "A" and "B" equally (half "A" and half "B")
  type_trials$rule <- sample(c("A", "B"), size = nrow(type_trials), replace = TRUE)
  # Ensure half are "A" and half are "B"
  type_trials$rule[1:(nrow(type_trials) / 2)] <- "A"
  type_trials$rule[(nrow(type_trials) / 2 + 1):nrow(type_trials)] <- "B"
  # Reassign back to the main dataframe
  all_trials[all_trials$Type == t, ] <- type_trials
}

# Filler Trials
all_trials[49,4] <- "A"
all_trials[50,4] <- "B"

# Add Absolute Difference in Payoffs
all_trials$abs_diff_payoff <- abs(all_trials$Payoff_A - all_trials$Payoff_B)

# Create a new rule assignment with the specified conditions
# Step 1: Randomly choose 25% of the trials where B is lower than A, with rule A or B
lower_B_trials <- which(all_trials$Payoff_B < all_trials$Payoff_A)  # Identify trials where B < A

# 25% of these trials will have rule A, 25% will have rule B
num_to_change <- round(length(lower_B_trials) * 0.25)

# Randomly sample indices for which rule changes will occur
change_indices_A <- sample(lower_B_trials, num_to_change)

# Assign rule A to these trials (even if rule was already A)
all_trials$rule[change_indices_A] <- "A"

# Assign rule B to the remaining 25% where B < A
remaining_indices_B <- setdiff(lower_B_trials, change_indices_A)
change_indices_B <- sample(remaining_indices_B, num_to_change)

all_trials$rule[change_indices_B] <- "B"

# Add a column with a unique random number between 1 and 99
all_trials$random <- sample(1:99, size = nrow(all_trials), replace = FALSE)

# Identify duplicate rows
duplicate_rows <- all_trials[duplicated(all_trials), ]

# Print duplicate rows
if (nrow(duplicate_rows) > 0) {
  print("Duplicate rows found:")
  print(duplicate_rows)
} else {
  print("No duplicate rows found.")
}

# Count the number of duplicates
num_duplicates <- nrow(duplicate_rows) # none

# Plot histogram of abs_diff_payoff
ggplot(all_trials, aes(x = abs_diff_payoff)) +
  geom_histogram(binwidth = 5, fill = "skyblue", color = "black") +
  labs(
    title = "Distribution of Absolute Differences in Payoffs",
    x = "Absolute Difference in Payoff",
    y = "Count"
  ) +
  theme_minimal()

# Check for prob(Rule is A)
print(paste("Proportion of trials where A is the rule:", sum(all_trials$rule == "A")/nrow(all_trials) )) # should be about half
print(paste("Proportion of type 1 trials where A is the rule:", sum(all_trials$rule == "A" & all_trials$Type == 1)/nrow(all_trials) )) # should be about 16%
print(paste("Proportion of type 2 trials where A is the rule:", sum(all_trials$rule == "A" & all_trials$Type == 2)/nrow(all_trials) )) # should be about 16%
print(paste("Proportion of type 3 trials where A is the rule:", sum(all_trials$rule == "A" & all_trials$Type == 3)/nrow(all_trials) )) # should be about 16%

all_trials <- all_trials[sample(nrow(all_trials)), ]

all_trials <- cbind(ball_trial_nr = seq(1, nrow(all_trials)), all_trials)


# Save trials to a CSV file
write.csv(all_trials, "ball_trials.csv", row.names = FALSE)


# Loop through each row of the selected columns and create the text you want
output_list <- list()
for (i in 1:nrow(all_trials)) {
  temp_dict <- list(
    F = all_trials[i, "Payoff_A"],
    J = all_trials[i, "Payoff_B"],
    rule = all_trials[i, "rule"],
    random = all_trials[i, "random"]
  )
  output_list[[i]] <- paste0("{\n  \"", paste(names(temp_dict), sapply(temp_dict, function(x) x), sep = "\": ", collapse = ",\n  \""), "\"\n},")
}

# Print the output
cat(paste(output_list, collapse = "\n"))

# Determine which option is chosen for each trial
all_trials$Chosen_Payoff <- ifelse(all_trials$Payoff_A > all_trials$Payoff_B, all_trials$Payoff_A, all_trials$Payoff_B)

# Determine which option is chosen for each trial
all_trials$Worse_Payoff <- ifelse(all_trials$Payoff_A < all_trials$Payoff_B, all_trials$Payoff_A, all_trials$Payoff_B)

# Compute the expected payoff (average chosen payoff)
expected_payoff <- mean(all_trials$Chosen_Payoff)

# View the expected payoff
print(expected_payoff)

# View the max payoff 
print(max(all_trials$Chosen_Payoff))

# View the min payoff 
print(min(all_trials$Chosen_Payoff))

# View the sum max payoff 
print(sum(all_trials$Chosen_Payoff))

# View the sum min payoff 
print(sum(all_trials$Worse_Payoff))
