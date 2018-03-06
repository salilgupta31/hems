/**
 * name
 */
export class FormatUtil {
    public static toFixedDecimal(value: any, divisor = 1, decimals= 1): number{
      if ( typeof value === 'number' ) {
          return  parseFloat((value / divisor).toFixed(2));
      }else {
          return parseFloat((parseFloat(value) / divisor).toFixed(2));
      }
   }

   public static checkString(str:string){
       if(str === undefined || str === null ) {
           str = '';
       }
       return str;
   }


   public static greetingText () {
       let currentTime = new Date();
       let hours = currentTime.getHours();

       if (hours < 12) {
           return "Good morning";
       } else if (hours >= 12 && hours < 16) {
           return "Good afternoon";
       } else if (hours >= 16) {
           return "Good evening";
       }
   };
}