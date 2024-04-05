---
layout: post
title: The Alignment Problem (Book Review)
subtitle: A fascinating history of one of the biggest challenges in AI
keywords: alignment problem, ai, machine learning, software
---

<!-- 
OUTLINE

QUOTES
"Everything is vague to a degree you do not realize till you have tried to make it precise."
- Bertrand Russell

NOTES
-------

INTRODUCTION
word2vec (by Google) (eg. Paris - France + Italy = Rome) had bias
ALIGNMENT PROBLEM - rewarding A, while hoping for B
PROBLEM: Often actual goal is hard to quantify, so we use something easier to quantify (closely related) as reward. But the system exploits loopholes (gap b/w A & B)

PART 1 - PROPHECY
CH. 1
- "Perceptrons" book: Neural networks with a single layer can't do many tasks
- Alexnet - first "deep learning" network (i.e. having multiple hidden layers)
- Google Photos AI classified black people as "Gorilla". Cause found: Camera lighting & lenses were optimised for white men
- Buolamwini & Gabru (Phd. Thesis) used training data from country parliaments to fix this
- But problem remains even with more data: world itself (esp. text) is biased! Some solutions to remove sexist bias didn't work:
    - Even if gender is omitted, system still was able to guess gender based on other factors
    - Omitting gender also has an issue that we need to know gender for some things, but not for others (eg. job application)
    - (Microsoft) Debiased embeddings:  Used Principal Component Analysis b/w gendered word pairs (eg. he & she) to identify "gender dimension". Selected 218 inherently gendered word pairs. Removed "gender dimension" from all other words.
    PROBLEM: Implicit connections b/w words like "nurse" and "receptionist" still remain. These are very hard to spot
    In other words, it's not sufficient to remove (gender, race) because other model params are correlated with them. This is called Redundant Encoding (the same base variable information is redundantly present jn multiple params)
    Ommitting these protected attributes (gender, race) from data can make problem worse - 1) bias can't be measured, because it's not accessible in the data 2) this can actually make model worse. Eg. an ATS system might penalise candidates for having job in last year. We might want to make exceptions for new mothers, but can't do it if gender is not present in data
- Word Embeddings bias as quantifying tool for social science (since this bias reflects actual bias in world)
- PROBLEM: as soon as model is released, people use it to generate content. If this model's output is used in training data for future models, bias is reinforced

CH. 2
- Pro Publica (newspaper) published report - COMPAS & other statistical systems (for predicting risk of prisoners committing future felony, used by courts) had racial bias
   HOW BIAS WAS DISCOVERED
   Identified what each model param actually is (TODO: how to do this??)
   Found 4 nonsensical params (i.e. they had no effect on risk) - 3 were identified by experts as proxies for race. 
   Prisoners unevenly distributed - blacks more in high-risk, whites more in low-risk
   Collected actual data of the prisoners (scraping & cleaning) & joined with model predictions to validate how many (white, black) prisoners model risk predictions (of re-offending) were actually right
- COMPAS response: model calibrated, equally accurate (61%) for Whites & Blacks
- Pro Publica rebuttal: In the 39% cases where model is wrong, very different for Whites, Blacks: most low-risk Blacks categorized as high-risk, & high-risk Whites categorized as low-risk
- Fairness & Privacy are linked
- Fairness through Blindness doesn't work (see prev Ch. points for why simply omitting gender, race, etc. in data doesn't work)
- (Page 74) 2 mathematical definitions of fairness, impossible to satisfy both at same time, whether by machine or by humans. Domain-specific tradeoff (which definition to prioritise)
- Training data for COMPAS only has cases of re-offense and re-conviction (of course, we don't know anything about the criminals whose perpetrators were never arrested!) So it's intended to predict crime, but it's actually predicting future policing.
MORAL: Sometimes the "ground truth" is not actually true!
- Predictions can sometimes even make things worse! Eg. A road-safety system identifies that aggregate men more likely to speed. Pulling over these men might not affect their behaviour at all, but can give a free pass to women, which makes the road less safe!
- Predictions no good if we don't know how to act on them!
TODO: NOTE REM MATERIAL IN CH. 2


Reinforcement Learning (or "Trial & Error" learning): when rewards aren't immediately known (eg. making a chess move), can still estimate how good current situation is. Comparing current expectation with past expectation gives an idea of whether move was good or bad
Dopamine in humans does the same thing: it spikes when future expectation of reward seems to be better than previous expectation.
This is called "Temporal Difference Error"


SHAPING (Researcher "Skinner")
Designing Reward Functions is hard. One approach that works well is to design successive (more & more accurate) approximations of the actual goal. But doing this can be tricky - "folly of rewarding A, while hoping for B"
    One solution to this is to reward states of the world rather than bot's actions. (i.e., subtracting points for wrong actions is as important as rewarding correct actions) (Like Conservation of Potential Energy in Physics - bot's total points should always reflect how close it is to goal. If after 2 actions, bot is back to where it started, then its total points should not change).

Another is curriculum based approach, like how children learn in a school environment instead of leaving them in the real world from the start (TODO: didn't really understand difference between the two)

-->