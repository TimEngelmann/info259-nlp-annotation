## About the project
For this project, we wanted to identify the archetype of main characters in youth literature. Because we had to do 1000 annotations, it made sense to spend a little (or a little too much) time on building a custom annotation tool. It highlights the name of the preidentified character and explains each archetype in detail. For more details on the annotation task, feel free to check out annotation_guidelines.pdf.

## Check it out live
I deployed a demo version to vercel, where you can try annotating 3 demo descriptions. 
- Website: https://info259-nlp-annotation.vercel.app/login
- Username: guest@annotation-project.edu
- Password: wvPW@p2MW9LNLb6H6Y-sepG2

Please note that the application is not optimized for mobile use. 
If you wish to use the tool for your individual annotations (not adjudication), please follow these steps:

1. Click on “Online” in the upper right corner, and you’ll be redirected to the offline version
2. Drag and drop the annotations you wish to make as a CSV in the required format
3. Start annotating
4. Save your annotations very frequently by clicking “save CSV”. Note that your progress will be lost if you reload without saving. You can use a saved CSV as a starting point for a new session.

## Feature List

This web app allows users to annotate pre-labeled data more quickly

Features include:
* highlight specific words (such as names) in the annotation text
* show a detailed description of labels
* quickly annotate data assigned to user
* in the role of adjudicator, quickly look at prior annotations
* show overall progress and set session goals
* online version is connected to firebase backend
* offline version can be used by dragging in a CSV 

## Dataset
For our project, we used a publically available goodreads.com dataset, which you can find here: https://sites.google.com/eng.ucsd.edu/ucsdbookgraph/home
We want to underline (as the original authors did) that the data is only intended for academic use.

## Questions?
This annotation task is part of a larger project with the title: "Archetypal Character Analysis on Literary Fiction for Young Adults". You can find the related GitHub here:
For all other questions, feel free to reach out!
