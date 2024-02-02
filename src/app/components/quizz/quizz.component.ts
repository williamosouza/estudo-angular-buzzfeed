import { Component } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';
import draw_questions from '../../../assets/data/draw_questions.json';


@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})


export class QuizzComponent {

  title:string = ""

  questions:any
  questionSelected:any
  drawQuestion:any
  drawQuestionSelected:any

answers:string[] = []
answersSelected:string = ""
imageAnswer:string = ""

questionIndex:number = 0
questionMaxIndex:number = 0
drawIndex:number = 0
drawOption:string[] = []

finished:boolean = false
draw:boolean = false
buttonCurrent:boolean = false
buttonDraw:boolean = false
option: any;

  constructor(){

  }

  ngOnInit():void {
    if(quizz_questions){
      this.finished = false;
      this.draw = false;
      this.buttonCurrent = false;
      this.buttonDraw = false;
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]
      this.drawQuestion = draw_questions.questions[this.drawIndex]
      


      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length
      this.drawIndex = 0
      this.drawOption = []
    }
  }

  // ao clicar na resposta, aciona a função que inclui valor no array de resposta e segue o nextstep

  playerChoose(value:string){
    this.nextStep()
    this.answers.push(value)
    console.log(this.answers)
  }

  // ao clicar, seleciona o resultado final em uma condição de empate

    drawChoose(value:string){
    console.log(value)
    this.finished = true
    this.draw = false
    this.buttonDraw = false
    this.answersSelected = quizz_questions.results[value as unknown as keyof typeof quizz_questions.results]
    this.imageAnswer = quizz_questions.images[value as unknown as keyof typeof quizz_questions.images]
  }

  // findOptionsDraw devolve somente as opções de texto do arrey gerado nos resultados empatados, dando a opção de somente
  // escolher entre dois ou mais empatados.

  async findOptionsDraw(id:any){
    const option:any = this.drawQuestion.options.find((option: { id: any; }) => option.id === id);
    return option ? option.name : null;
    }


  

  async nextStep(){
    this.questionIndex+=1

      if(this.questionMaxIndex > this.questionIndex){
        this.questionSelected = this.questions[this.questionIndex]
      } else {
        const finalAnswer:string[] = await this.checkResults(this.answers)
          if(finalAnswer.length <= 1){
            this.finished = true
            this.buttonCurrent = true
            this.answersSelected = quizz_questions.results[finalAnswer as unknown as keyof typeof quizz_questions.results]
            this.imageAnswer = quizz_questions.images[finalAnswer as unknown as keyof typeof quizz_questions.images]
            console.log(finalAnswer)
          } else {
            this.drawOption = finalAnswer
            this.draw = true
            this.buttonCurrent = true
            this.buttonDraw = true
            
          }
       
      }
  }

  // a função pega o array de respostas e conta as incidências de cada alias. O maior valor de incidências, é reconhecido,
  // transformando em objeto com o alias e valor. O maior valor é reconhecido. Um novo array é criado somente com os alias
  // reconhecidos com o maiorValor.
  // Se houver empate, sai um array com mais de um elemento, que será tratado na lógica de empate. O array de empatados sempre
  // terá a quantidade máxima de finais possíveis, nada mais.

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
    
    let result:any[]= array.filter(item => item !== null);

    return result    
    
    }



}
