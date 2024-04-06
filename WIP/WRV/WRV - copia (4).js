"use strict";

function initializeUI() {

    let testProgram1=	
    "addi t0, zero, -0x23"+ "\n"+
	"   andi t0, t0, -0xf"+"\n"+
    "             \n"+
	"addi t0, t0, 0xA0"+"\n"+
	    // ilegal operands: "addi t9, t0, 0xA0"+"\n"+
    "addi t2, zero, -0x13"+"\n"+
    "sw t2, 0(zero)  "+"\n"+
    "lw t1, 0(zero)  ";

    let testProgram2=
    "addi t0, zero, 0\n"+
    "addi t1, zero, 5\n"+
    "incloop:\n"+
    "addi t0, t0, 1\n"+
    "blt t0, t1, incloop\n"+
    "programExit:";

    let testProgram3=
    "   addi t0, zero, 0 \n"+
    "   jal ra, a10 \n"+
    "    jal zero, programexit \n"+
    "    addi t0, zero, zero \n"+
    "     a10:   \n"+
    "   addi t0, t0, 10 \n"+
    "   jalr a0, 0(ra) \n"+
    " programexit:    ";

    let testProgram4=
    `.data
    dataword1:
        .word 0x12345678
    string1:\n
        .asciiz "Hello World!\\n" \n
    dataword2:\n
        .word 0xABCDEF01\n
             
    string2:\n
        .asciiz "This is string 2\\n"\n
    \n
        #here it goes the code\n
        .text\n
        \n
    main:\n
    \n
    la a0, dataword2    
        la a1, programexit    
        la a3, dataword1
    li t0, 0x12345678 
    lw t1, 0(a3)
    lw t2, 0(a0)
    
        jal zero, programexit\n
                \n
    #\n
    # program exit point\n
    programexit:`;

    let testProgramSyscalls1=
    `
    .data
    helloString:
        .asciiz "Hello World!\\n"
    .text
    li a0, 0            #print string syscall
    la a1, helloString  #asciiz string addr
    ecall
    `;

    let testProgramSyscalls2=
    `
    li a0, 1      #print number syscall
    li a1, 12345  #number to print
    ecall
    `;

    let testProgramSyscalls3=
    `
    .data 
    userp:
    .asciiz "Please, enter a number"

    .text
    li a0, 2        #prompt the user for a number
    la a1, userp    #string to print
                    #returns the number in a0
    ecall
    `;

    let testProgramSyscalls4=
    `
    .data 
    userp:
    .asciiz "Please, enter a your name"
    heapStartsHere:

    .text
    li a0, 3                #prompt the user for text
    la a1, userp            #string to print
    la a2, heapStartsHere   #at this address, the string will be written
                            #returns the string at the address in a2                            
    ecall
                            #now, we print the string given
    li a0, 0
    la a1, heapStartsHere
    ecall
    `;

    let testProgram5=`
    .data
    word1:
        .word -12345678
    heap:
    .text
    li t0, -12345678
    la a0, word1
    lw t1, 0(a0)
    sw t0, 4(a0)
    lw t2, 4(a0)
    `;

    let testProgram=testProgram5;
    //transform the program into an array of lines
    let testProgramL=testProgram.split("\n");


    // initialize editor https://ace.c9.io/#nav=howto
    var editor = ace.edit("editor");
    //editor.setTheme("ace/theme/monokai");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
    editor.setReadOnly(true);
    editor.setHighlightActiveLine(true);

    //load test program into editor
    editor.setValue(testProgram);
    editor.gotoLine(1); // go to first line

    // reset textarea content
    document.getElementById('MyTextArea').value = '';
    window.debug=true;
    /*for (let i=0; i<15; i++) {
        document.getElementById('MyTextArea').value += "linea "+i+"\n";
    }*/


    // set up the virtual machine
    let M=new Uint8Array(64*1024);
    let R= new Int32Array(32);
    let RN= ["zero", "ra", "sp", "gp", "tp", "t0", "t1","t2", "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"];
    let myMachine = {
        registers: R,
        registersNames: RN,
        programCode: testProgramL,
        currentProgramLine: 0,
        memory: M,
        dataLabelsInfo:null,

        // using methods to read/write registers we make sure x0 always =0
        readRegister: function(regnum) {
            this.registers[0]=0;
            return this.registers[regnum];
        },
        writeRegister: function(regnum, value) {
            this.registers[regnum]=value;
            this.registers[0]=0;
        },

        writeWordToMemory: function(memaddr, value) {
            this.memory[memaddr]=(value&0xff);
            this.memory[memaddr+1]=((value&0xff00)>>8);
            this.memory[memaddr+2]=((value&0xff0000)>>16);
            this.memory[memaddr+3]=((value&0xff000000)>>24);
        },
        readWordFromMemory: function(memaddr) {
            let w=0;
            w=w|this.memory[memaddr];
            w=w|(this.memory[memaddr+1]<<8);
            w=w|(this.memory[memaddr+2]<<16);
            w=w|(this.memory[memaddr+3]<<24);
            return w;
        },
        writeByteToMemory: function(memaddr, value) {
            this.memory[memaddr]=value;
        },
        readByteFromMemory: function(memaddr) {
            return this.memory[memaddr];
        }


    };
    for (let i=0; i<32; i++) {
        myMachine.writeRegister(i, 0);
    }

    // Data processing here: first we go to the data section and process the data
    let pdsResult=processDataSection(myMachine);
    if (!pdsResult) return; // if there are data errors, no more actions are performed

    //advance the currentProgramLine to the .text section, if it exists
    for (let i=0; i<myMachine.programCode.length; i++) {
        let myLine=myMachine.programCode[i];
        if (myLine.includes(".text")) {
            myMachine.currentProgramLine=i+1;
            break;
        }
    }

    // simulate execution
    try {
        while (myMachine.currentProgramLine<myMachine.programCode.length) {

            //clean the asm line of tabs, spaces and comments
            let cleanLine=cleanASMLine(myMachine.programCode[myMachine.currentProgramLine]);
            let firstToken=getFirstToken(myMachine.programCode[myMachine.currentProgramLine]);

            // try to execute line
            executeLine(cleanLine, myMachine, firstToken); 

            // advance program line
            myMachine.currentProgramLine++;
        }
    } catch (err) {
        document.getElementById('MyTextArea').value+="ERROR: "+err.message+ " in line "+(myMachine.currentProgramLine+1)+"\n";
    }
/*    
    //test
    let lln=findLabelInSource(myMachine, "programexit");
    document.getElementById('MyTextArea').value+="findLabelInSource label at "+lln+"\n";
*/
    //let myRegistersDiv = document.getElementById('RegistersDiv');
    //myRegistersDiv.innerHTML="<p>hola</p>";
    updateRegistersInHTML(myMachine);
}

// returns the line number a label is at, or -1 if not found
function findLabelInSource(machinep, labelp) {
    for (let i=0; i<machinep.programCode.length; i++) {
        let cleanLine=cleanASMLine(machinep.programCode[i]);
        if (cleanLine.indexOf(labelp+":")!=-1) {
            return i;
        }
    }
    return -1;
}

//clean the asm line of tabs, spaces and comments
function cleanASMLine(lineToClean) {
    //clean line of tabs and spaces
    let lineWithoutSpacesAndTabs="";
    for (let i=0; i<lineToClean.length; i++) {
        if (lineToClean[i]=="#") break; // we don't want comments in the clean line
        if ((lineToClean[i]!=" ")&&(lineToClean[i]!="\t")) {
            lineWithoutSpacesAndTabs+=lineToClean[i];
        }
    }
    return lineWithoutSpacesAndTabs;
}

function getFirstToken(linep) {
    //clean line of tabs and spaces
    let lineWithoutComments="";
    for (let i=0; i<linep.length; i++) {
        if (linep[i]=="#") break; // we don't want comments in the clean line
        lineWithoutComments+=linep[i];
    }
    
    // return the first non empty token
    let tokens=lineWithoutComments.split(" ");
    for (let i=0; i<tokens.length; i++) {
        if (tokens[i].length>0)
        return tokens[i];
    }
    return ""; // else, return a null token
}

function updateRegistersInHTML(machine) {
    let myRegistersDiv = document.getElementById('RegistersDiv');
    let s="<table id=\"RegsTable\"><tr> <th>Register</th> <th>Value</th> </tr>";
    for (let i=0; i<32; i++) {
        s+= "<tr> <td>x"  +i+" "+machine.registersNames[i]+   "</td> <td>"+machine.registers[i]+"</td> </tr>";
    }
    s+="</table>";
    myRegistersDiv.innerHTML=s;
    //myRegistersDiv.innerHTML="<table><tr><th>Register</th><th>Value</th></tr><tr><td>x0 zero</td><td>value</td></tr><tr><td>x1 ra</td><td>0 orsth</td></tr>";
}

// execute an ASM line
function executeLine(lineWithoutSpacesAndTabs, machinep, firstTokenp) {

    let recognizedLine=false; // indicates whether line was recognized as instruction or not
    if ((lineWithoutSpacesAndTabs.length==0)||lineWithoutSpacesAndTabs[lineWithoutSpacesAndTabs.length-1]==":")
    {
        recognizedLine=true;
    }
    else {
        
        //ADDI
        if (firstTokenp.includes("addi")) {
            // decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)+decInstr.immediate);
            recognizedLine=true;

            printDebugInfo("[ADDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //ANDI
        if (firstTokenp.includes("andi")) {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)&decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[ANDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //SW
        if (firstTokenp.includes("sw")) {
            // decode line
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            //execute line
            machinep.writeWordToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );
            recognizedLine=true;

            printDebugInfo("[SW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");
        }

        //LW
        if (firstTokenp.includes("lw")) {
            // decode line
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
            recognizedLine=true;

            printDebugInfo("[LW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
        }

        //BLT
        if (firstTokenp.includes("blt")) {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)<machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }

            printDebugInfo("[BLT x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //JAL
        if (firstTokenp.includes("jal")&&(!firstTokenp.includes("jalr"))) {
            let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
            throw new Error ("label not found in source");
            }

            // execute the jal instruction
            machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
            machinep.currentProgramLine=lln;
            recognizedLine=true;

            printDebugInfo("[JAL x"+decInstr.operand1+" label "+decInstr.label+" ]\n");            
        }

        //JALR
        if (firstTokenp.includes("jalr")) {
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            // it's a jalr instruction, execute it
            machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
            machinep.currentProgramLine=machinep.readRegister(decInstr.operand2)+decInstr.immediate;
            recognizedLine=true;

            printDebugInfo("[JALR x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n");            
        }

        //ECALL
        if (firstTokenp.includes("ecall")) {
            
            // call OS
            // registers aX contain the function codes
            recognizedLine=true;
            printDebugInfo("[ECALL]\n");            

            executeSyscalls(machinep);
        }

        // PSEUDOINSTRUCTIONS

        //LI
        if (firstTokenp.includes("li")) {
            let decInstr=decodeRIMMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            // execute it
            machinep.writeRegister(decInstr.operand1, decInstr.immediate);
            recognizedLine=true;

            printDebugInfo("[LI x"+decInstr.operand1+" IMM " +decInstr.immediate+" ]\n");            
        }

        //LA
        if (firstTokenp.includes("la")) {
            let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            // execute it
            //first we try to find the label in the data labels
            let labelFoundInData=false;
            let labelFoundInDataAddr;
            for (let el of machinep.dataLabelsInfo) {
                if (el.label==decInstr.label) {
                    labelFoundInData=true;
                    labelFoundInDataAddr=el.addr;
                }
            }
            // if it's not among the data labels, we try to find it among the code labels
            if (labelFoundInData) {
                machinep.writeRegister(decInstr.operand1, labelFoundInDataAddr);
                recognizedLine=true;
            }
            else {
                let lln=findLabelInSource(machinep, decInstr.label);
                if (lln==-1) {
                    throw new Error ("label not found in source");
                }
                else {
                    machinep.writeRegister(decInstr.operand1, lln);
                    recognizedLine=true;
                }    
            }

            printDebugInfo("[LA x"+decInstr.operand1+" LABEL " +decInstr.label+" ]\n");            
        }
    }

    if (!recognizedLine) {
        throw new Error ("Instruction not recognized");
    }


}  

// decode an Reg-Reg-Imm instruction into operands
function decodeRRILine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=3) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }
    let imm=parseInt(splitInstr[2]);
    if (isNaN(imm)) {
        throw new Error ("ilegal immediate value");
    }

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        immediate: imm
    }
    
    return decodedInstr;
}

// decode instruction: instr R, imm(R)
function decodeRMEMLine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=2) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let imm=parseInt(splitInstr[1]);
    if (isNaN(imm)) {
        throw new Error ("ilegal immediate value");
        
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        immediate: imm
    }
    
    return decodedInstr;
}

// decode instructions: instr R, R, label
function decodeRRLabel(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=3) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[1].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }
    if ((op1==-1)||(op2==-1)) {
        throw new Error ("ilegal instruction operands");
    }
    let labl=splitInstr[2];

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        label: labl
    }
    
    return decodedInstr;
}

// decode instruction: instr R, label
function decodeRLabelLine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=2) {
        throw new Error ("Ilegal instruction operands");
    }

    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }

    if (op1==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let labl=splitInstr[1];

    let decodedInstr = {
        operand1: op1,
        label: labl
    }
    
    return decodedInstr;    
}

// decode instruction: instr R, imm
function decodeRIMMLine(textLine, myMachinep) {
    let splitInstr=textLine.split(",");
    if (splitInstr.length!=2) {
        throw new Error ("Ilegal instruction operands");
    }
    
    // check for operators
    let op1=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[0].includes(myMachinep.registersNames[i])) {
            op1=i;
        }
    }
    let imm=parseInt(splitInstr[1]);
    if (isNaN(imm)) {
        throw new Error ("ilegal immediate value");
        
    }
    if(op1==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        immediate: imm
    }
    
    return decodedInstr;
}

function processDataSection (myMachine) {
    let currentDataLine; // current data line
    let myDataLabels=[];
    try {
        let dataStarted=false;
        let currentDataAddr=myMachine.programCode.length*4; // we reserve space for future needs, like program instructions
        for (currentDataLine=0; currentDataLine<myMachine.programCode.length; currentDataLine++) {
            let dataLine=myMachine.programCode[currentDataLine];
            if (dataLine.includes(".data")) {
                dataStarted=true;
            }
            if (dataLine.includes(".text")) {
                dataStarted=false;
                break;
            }

            if (dataStarted) {
                let cleanDataLine=cleanASMLine(myMachine.programCode[currentDataLine]);
                let recognizedLine=false; // stores whether a line was recognized as a valid data line

                if (cleanDataLine.includes(".word")) {
                    let imm=parseInt(cleanDataLine.slice(5));
                    if (isNaN(imm)) {
                        throw new Error ("ilegal immediate value");
                    } 

                    // write word to memory
                    myMachine.writeWordToMemory(currentDataAddr, imm);
                    recognizedLine=true;

                    currentDataAddr+=4; // increment data address pointer

                    // info output
                    printDebugInfo("DATA .word: ["+imm+"]\n");
                }

                if (cleanDataLine.includes(".asciiz")) {
                    let splitDataLine=dataLine.split("\"");
                    if (splitDataLine.length!=3) {
                        throw new Error ("error in string");
                    }
                    let enteredString=splitDataLine[1].replace("\\n", "\n"); // by now, \n is the only special char we recognize

                    // write string to memory
                    for (let ii=0; ii<enteredString.length; ii++) {
                        myMachine.writeByteToMemory(currentDataAddr+ii, enteredString.codePointAt(ii));
                    }
                    myMachine.writeByteToMemory(currentDataAddr+enteredString.length, 0); // write null char
                    recognizedLine=true;

                    currentDataAddr+=enteredString.length+1; // include null, increment data address pointer

                    // info output
                    printDebugInfo("DATA .asciiz: ["+enteredString+"]\n");
                }

                if (cleanDataLine[cleanDataLine.length-1]==":") {
                    let dataLabel=cleanDataLine.slice(0, cleanDataLine.length-1);

                    //add it to data labels list
                    let dataLabelNode= {
                        label:dataLabel,
                        addr:currentDataAddr
                    }
                    myDataLabels.push(dataLabelNode);
                    recognizedLine=true;

                    // info output
                    printDebugInfo("DATA LABEL ["+dataLabel+"] at data addr ="+currentDataAddr+"\n");
                }

                if ((cleanDataLine.length==0)||(dataLine.includes(".data"))) {
                    recognizedLine=true; // if line is blank, we recognize the line as valid
                }

                //checks if a line is recognized as data or not
                if (!recognizedLine) {
                    throw new Error ("Unrecognized data Line");
                }
            }
        }
    } catch (err) {
        document.getElementById('MyTextArea').value+="ERROR: "+err.message+ " in line "+(currentDataLine+1)+"\n";
        return false;
    }
    myMachine.dataLabelsInfo=myDataLabels; // add the data labels info to the virtual machine
    // DEBUG info
    printDebugInfo("DATA LABEL TABLE BEGIN \n");
    for (let i of myDataLabels) {
        printDebugInfo("["+i.label+" addr ="+i.addr+"]\n");
    }
    printDebugInfo("DATA LABEL TABLE END \n");
    //
    return true;
}

function printDebugInfo(textp) {
    if (window.debug==true)
    document.getElementById('MyTextArea').value+=textp;
}

function executeSyscalls(machinep) {
    
    // a0 contains the main function code

    // print string code
    if (machinep.readRegister(10)==0) {        
        // string addr is at a1
        let strAddr=machinep.readRegister(11);
        let chrCode=machinep.readByteFromMemory(strAddr);
        let str="";
        while (chrCode!=0) {
            str+=String.fromCodePoint(chrCode);
            strAddr++;
            chrCode=machinep.readByteFromMemory(strAddr);
        }
        document.getElementById('MyTextArea').value+=str;
        //printDebugInfo("string print os call");
    }

    // print number code
    if (machinep.readRegister(10)==1) {

        // number to print is at a1
        let numberToPrint=machinep.readRegister(11);
        document.getElementById('MyTextArea').value+=""+numberToPrint;
        //printDebugInfo("string print os call");
    }

    // ask the user to enter a number
    if (machinep.readRegister(10)==2) {        
        // string to ask the user addr is at a1
        let strAddr=machinep.readRegister(11);
        let chrCode=machinep.readByteFromMemory(strAddr);
        let str="";
        while (chrCode!=0) {
            str+=String.fromCodePoint(chrCode);
            strAddr++;
            chrCode=machinep.readByteFromMemory(strAddr);
        }

        let myNumberStr=prompt(str, "0");
        machinep.writeRegister(10, parseInt(myNumberStr));
        
        //printDebugInfo("string print os call");
    }

    // ask the user to enter a string
    if (machinep.readRegister(10)==3) {        
        // string to ask the user addr is at a1
        let strAddr=machinep.readRegister(11);
        let chrCode=machinep.readByteFromMemory(strAddr);
        let str="";
        while (chrCode!=0) {
            str+=String.fromCodePoint(chrCode);
            strAddr++;
            chrCode=machinep.readByteFromMemory(strAddr);
        }

        let enteredString=prompt(str, "");
        let enteredStringAddr=machinep.readRegister(12); // a2 contains the addr to write the string to
        for (let i=0; i<enteredString.length; i++) {
            machinep.writeByteToMemory(enteredStringAddr+i, enteredString.codePointAt(i));
        }
        machinep.writeByteToMemory(enteredStringAddr+enteredString.length, 0); // write null char
        // write the string to the 
        
        //printDebugInfo("string print os call");
    }

}