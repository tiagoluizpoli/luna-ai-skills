#!/usr/bin/env bash

# ⚡ MATT POCOCK'S RALPH LOOP RUNNER ⚡
# Runs the agy CLI in an autonomous loop to resolve issues iteratively without permission interrupts.

set -o pipefail

# ANSI Color Codes for Matt Pocock Style logs
BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
NC='\033[0m' # No Color

echo -e "${BOLD}${CYAN}===========================================${NC}"
echo -e "${BOLD}${CYAN}    ⚡ MATT POCOCK'S RALPH LOOP RUNNER ⚡   ${NC}"
echo -e "${BOLD}${CYAN}===========================================${NC}"

# Step 1: Upfront check for prompt.md
if [ ! -f "prompt.md" ] || [ ! -s "prompt.md" ]; then
  echo -e "${YELLOW}❓ prompt.md is missing or empty.${NC}"
  echo -n -e "Enter the instructions for the agent loop: "
  read -r user_prompt
  
  if [ -z "$user_prompt" ]; then
    echo -e "${RED}❌ Error: A prompt is required to start the loop.${NC}"
    exit 1
  fi
  
  # Create a default structure for prompt.md
  cat <<EOF > prompt.md
---
issueId:
---
$user_prompt
EOF
  echo -e "${GREEN}📝 prompt.md created with your instructions!${NC}"
fi

# Step 2: Upfront check for prod.md
if [ ! -f "prod.md" ]; then
  echo -e "${YELLOW}📝 prod.md is missing. Creating default prod.md...${NC}"
  cat <<EOF > prod.md
# Production Specifications

## Constraints
- Always verify edits with test runs or code audits.
- Maintain existing architecture styles and patterns.
EOF
fi

# Step 3: Upfront verification of issue folder
if [ ! -d ".specify/memory/issues" ]; then
  echo -e "${YELLOW}📁 Creating directory .specify/memory/issues/ ...${NC}"
  mkdir -p .specify/memory/issues
fi

# Step 4: Reset progress.txt for a fresh loop run
echo -n "" > progress.txt

# Step 5: Execution Loop
MAX_ITERATIONS=10

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo -e "\n${BOLD}${CYAN}🔄 Iteration [$i/$MAX_ITERATIONS]${NC}"
  
  # Check for loop termination patterns from iteration 2 onwards
  if [ $i -gt 1 ]; then
    if [ -f "progress.txt" ]; then
      if grep -qE "100% Complete|Loop Terminated|Success" progress.txt; then
        echo -e "\n${BOLD}${GREEN}🎉 SUCCESS: Loop completion detected in progress.txt!${NC}"
        echo -e "${BOLD}Last Progress Log:${NC}"
        tail -n 1 progress.txt
        exit 0
      fi
    fi
  fi

  start_time=$(date +%s)
  
  if [ $i -eq 1 ]; then
    echo -e "${YELLOW}🚀 Triggering initial run...${NC}"
    # Start the loop by loading the ralph-loop skill and passing the prompt
    agy --dangerously-skip-permissions --print "Start the Ralph Loop. Locate prompt.md, prod.md, and issues under .specify/memory/issues/. Follow the ralph-loop skill and execute the first iteration, then log your status to progress.txt."
  else
    echo -e "${YELLOW}⏭️ Continuing session...${NC}"
    # Continue the active conversation to keep prompt history and state intact
    agy --dangerously-skip-permissions -c --print "Continue the Ralph Loop. Execute the next iteration (Iteration $i), apply changes, and log status to progress.txt."
  fi
  
  cmd_status=$?
  end_time=$(date +%s)
  duration=$((end_time - start_time))
  
  if [ $cmd_status -ne 0 ]; then
    echo -e "\n${RED}❌ Error: agy CLI exited with status $cmd_status after ${duration}s.${NC}"
    exit $cmd_status
  fi
  
  echo -e "${GREEN}⏱️ Iteration $i completed in ${duration}s.${NC}"
  
  if [ -f "progress.txt" ] && [ -s "progress.txt" ]; then
    echo -e "${BOLD}Current Status:${NC} $(tail -n 1 progress.txt)"
  fi
done

echo -e "\n${BOLD}${YELLOW}⚠️ Warning: Reached maximum iterations ($MAX_ITERATIONS) without detecting completion.${NC}"
exit 0
