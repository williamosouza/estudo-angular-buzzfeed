import { Component } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';



@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})


export class QuizzComponent {

  title:string = ""

  questions:any
  questionSelected:any

answers:string[] = []
answersSelected:string = ""
imageAnswer:string = ""

questionIndex:number = 0
questionMaxIndex:number = 0

finished:boolean = false

  constructor(){

  }

  ngOnInit():void {
    if(quizz_questions){
      this.finished = false;
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length
    }
  }

  playerChoose(value:string){
    this.nextStep()
    this.answers.push(value)
    console.log(this.answers)
  }

  async nextStep(){
    this.questionIndex+=1

      if(this.questionMaxIndex > this.questionIndex){
        this.questionSelected = this.questions[this.questionIndex]
      } else {
        const finalAnswer:string = await this.checkResults(this.answers)
        this.finished = true
        this.answersSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]
        this.imageAnswer = quizz_questions.images[finalAnswer as keyof typeof quizz_questions.images]
        console.log(finalAnswer)
      }
  }

  //async checkResults(answers:string[]){
  //  const result = answers.reduce((previous, current, i, arr)=>{
  //    if ( 
  //      arr.filter(item => item === previous).length > 
  //      arr.filter(item => item === current).length     
  //      ){
  //        return previous
  //      } 
  //      else {
  //        return current
  //      }
  //      
  //    })
  //   
  //    return result
  //}

  async checkResults(letras:string[]){

    let contagem: Record<string, number> = {};
    
    contagem = letras.reduce((contador:any, letra:string) => {
      contador[letra] = (contador[letra] || 0) + 1;
      return contador;
    }, {});
    
    const maiorValor = Math.max(...Object.values(contagem))
    
    var array:any[] | null = Object.entries(contagem).map(([chave, valor]) => {
      if (valor === maiorValor){
        return chave
      } else {
        return null
      }
      
    });
    
    let result:string | null = array.filter(item => item !== null).join("");

    
    return result    
    
    }



}
