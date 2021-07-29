# About this project
This is a little idea I had to design my own programming language. The purpose of 
the language is to generate custom questions for math teachers based on a template.
The name of the project is retmajgau

# A sample Input
This language is not done yet, but when it is, I want to be able to do stuff like
```
{polynomial=randomBinomial()}
{answer=factor(polynomial)}
{wrongAnswers=wrongAnswer(factor)(polynomial)}
What is the correct factorization of {polynomial}?
{answers = shuffledAnswers(wrongAnswers, answer)}
```