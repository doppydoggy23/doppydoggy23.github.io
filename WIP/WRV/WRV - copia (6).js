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
        \t         \t           #returns the string at the address in a2                            
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

    let testProgram6=`
    .text
         li t0, -12345678
              andi t0, t0, -1234
       \t\t      \t\t      \t\t      li t1, -12345678
    ori t1, t1, -1234
    li t2, -12345678
    xori t2, t2, -1234
    li t3, -12345678
    li t4, 0xABCDEF12
    add t3, t3, t4
    sub t4, t4, t2
    and a0, t3, t4
    or a1, t4, t3
    xor a2, t4, t3
    `;

    let testProgram7=`
    addi t0, zero, -1
    addi t1, zero, 0
    addi t2, zero, 1

    addi a0, zero, 0
    addi a1, zero, 0
    
    beq t0, t0, sig1
    addi a0, a0, 1
sig1:
    bne t0, t1, sig2
    addi a0, a0, 1
sig2:
    blt t1, t2, sig3
    addi a0, a0, 1
sig3:
    bge t2, t0, sig4
    addi a0, a0, 1

sig4:
    beq t0, t1, sig5
    addi a1, a1, 1
sig5:
    bne t0, t0, sig6
    addi a1, a1, 1
sig6:
    blt t2, t1, sig7
    addi a1, a1, 1
sig7:
    bge t0, t1, sig8
    addi a1, a1, 1
sig8:
    `;

    let testProgram8=`
    addi t0, zero, -1
    addi t1, zero, 0
    addi t2, zero, 1

    addi a0, zero, 0
    addi a1, zero, 0
    
    bgt t2, t1, sig1
    addi a0, a0, 1
sig1:
    ble t0, t1, sig2
    addi a0, a0, 1
sig2:

    bgt t0, t1, sig1
    addi a1, a1, 1    
sig3:
    bgt t0, t2, sig1
    addi a1, a1, 1    
sig4:`;

    let testProgram9=`
    main:

    addi t0, zero, 0
    call add10
    j programexit
    addi t0, zero, -1
    
add10:
    addi t0, t0, 10
    ret
            
#
# program exit point
programexit:`;

    let testProgram10=`
    li t0, 0xABCD1234
    li t1, -12345678
    li t2, -12345678
    li t3, 6
    sll t0, t0, t3
    srl t1, t1, t3
    sra t2, t2, t3
    
    li a0, 0xABCD1234
    li a1, -12345678
    li a2, -12345678
    slli a0, a0, 6
    srli a1, a1, 6
    srai a2, a2, 6
    `;

    let testProgram11=`
    li t0, 0
    li t1, -1
    li t2, 1
    slt a0, t1, t0
    slt a1, t2, t1
    sltu a3, t2, t1
    sltu a4, t1, t0

    slti a5, t1, 0
    slti a6, t2, 0
    sltiu s0, t2, 10
    sltiu s1, t1, -10

    li t3, -100
    sltiu s2, t3, -10
    `;

    let testProgram12=`
    lui t0, 0xABCDE
    auipc t1, 0xABCDE`;

    let testProgram13=`
    li t0, 0
    li t1, -1
    li t2, -2
    li a0, 0
    li a1, 0
    
    bltu t0, t1, sig1
    addi a0, a0, 10
sig1:
    bgeu t1, t2, sig2
    addi a0, a0, 10
sig2:

    bltu t1, t2, sig3
    addi a1, a1, 1
sig3:
    bgeu t2, t1, sig4
    addi a1, a1, 1
sig4:
    `;

    let testProgram14=`
    .data
    dataword1:

    .text
    la a0, dataword1
    li t0, -10
    
    sb t0, 0(a0)
    lb t1, 0(a0)
    lbu t2, 0(a0)
    
    li t3, -1234
    sh t3, 0(a0)
    lh t4, 0(a0)
    lhu t5, 0(a0)
    `;

    let testProgram15=`
    .data
    dataword1:
    .text
    li t0, -1234567
    sw t0, dataword1, a0
    lw t1, dataword1

    li t2, -10
    sb t2, dataword1, a1
    lw t3, dataword1

    li t4, -1234
    sh t4, dataword1, a2
    lh t5, dataword1
    `;

    let emptyProgram=` `;

    let testProgram=emptyProgram;
    //transform the program into an array of lines
    let testProgramL=testProgram.split("\n");


    // initialize editor https://ace.c9.io/#nav=howto
    let editor = ace.edit("editor");
    //editor.setTheme("ace/theme/monokai");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
    editor.setReadOnly(true);
    editor.setHighlightActiveLine(true);

    //load test program into editor
    editor.setValue(emptyProgram);
    editor.gotoLine(1); // go to first line

    // reset textarea content
    document.getElementById('MyTextArea').value = '';
    
    // set global variables
    window.rawProgramToBeExecuted=emptyProgram;
    window.programToBeExecuted=emptyProgram.split("\n");
    window.codeEditor=editor;
    window.debug=true;
    window.virtualMachine=setupVirtualMachine(window.programToBeExecuted); //create virtual machine
    if (window.virtualMachine==null)
        return;

    // try to run the program
    executeProgramInVirtualMachine(window.virtualMachine);

    // here we setup the loading of new files into the virtual machine and code editor
    // when a file is loaded we setup the editor content
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', (event) => {

        var fr=new FileReader();
            fr.onload=function(){
                window.codeEditor.setValue(fr.result);
                window.codeEditor.gotoLine(1);

                window.rawProgramToBeExecuted=fr.result;

                // clean of charcode 13 (some editors introduce it)
                let cleanlines="";
                for (let i=0; i<window.rawProgramToBeExecuted.length; i++) {
                    if (window.rawProgramToBeExecuted.codePointAt(i)!=13) {
                        cleanlines+=window.rawProgramToBeExecuted[i];
                    }
                }

                window.programToBeExecuted=cleanlines.split("\n");                
                window.virtualMachine=setupVirtualMachine(window.programToBeExecuted);                
            }
              
            fr.readAsText(event.target.files[0]);
        });

    // we setup the event onclick for the Load Program Button
    const fileSelect = document.getElementById("LoadButton");
    fileSelect.addEventListener(
    "click",
    (e) => {
        if (fileSelector) {
            fileSelector.click();
        }
    },
    false
    );

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
    //clean line of comments and tabs
    let lineWithoutComments="";
    for (let i=0; i<linep.length; i++) {
        if (linep[i]=="#") break; // we don't want comments in the clean line
        if (linep[i]!="\t") // nor tabs
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
    if (machine==null) return;

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
        
        //ADD
        //if (firstTokenp.includes("add")&&(!firstTokenp.includes("addi"))) {
        if (firstTokenp=="add") {
            // decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)+machinep.readRegister(decInstr.operand3));
            recognizedLine=true;

            printDebugInfo("[ADD x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SUB
        //if (firstTokenp.includes("sub")) {
        if (firstTokenp=="sub") {
            // decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)-machinep.readRegister(decInstr.operand3));
            recognizedLine=true;

            printDebugInfo("[SUB x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //AND
        //if ((firstTokenp.includes("and"))&&(!firstTokenp.includes("andi"))) {
        if (firstTokenp=="and") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)&machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[AND x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //OR
        //if ((firstTokenp.includes("or"))&&(!firstTokenp.includes("ori"))&&(!firstTokenp.includes("xor"))&&(!firstTokenp.includes("xori"))) {
        if (firstTokenp=="or") {
                //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)|machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[OR x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //XOR
        //if ((firstTokenp.includes("xor"))&&(!firstTokenp.includes("xori"))) {
        if (firstTokenp=="xor") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)^machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[XOR x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SLL
        if (firstTokenp=="sll") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)<<machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[SLL x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SRL
        if (firstTokenp=="srl") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>>machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[SRL x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SRA
        if (firstTokenp=="sra") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>machinep.readRegister(decInstr.operand3)));
            recognizedLine=true;

            printDebugInfo("[SRA x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SLT
        if (firstTokenp=="slt") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            //machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>machinep.readRegister(decInstr.operand3)));
            if (machinep.readRegister(decInstr.operand2)<machinep.readRegister(decInstr.operand3)) {
                machinep.writeRegister(decInstr.operand1, 1);
            }
            else {
                machinep.writeRegister(decInstr.operand1, 0);
            }
            recognizedLine=true;

            printDebugInfo("[SLT x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //SLTU
        if (firstTokenp=="sltu") {
            //decode line
            let decInstr=decodeRRRLine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            //machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>machinep.readRegister(decInstr.operand3)));
            if ((machinep.readRegister(decInstr.operand2)>>>0)<(machinep.readRegister(decInstr.operand3)>>>0)) {
                machinep.writeRegister(decInstr.operand1, 1);
            }
            else {
                machinep.writeRegister(decInstr.operand1, 0);
            }
            recognizedLine=true;

            printDebugInfo("[SLTU x"+decInstr.operand1+" x"+decInstr.operand2+" x"+decInstr.operand3+"]\n");
        }

        //ADDI
        //if (firstTokenp.includes("addi")) {
        if (firstTokenp=="addi") {
            // decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readRegister(decInstr.operand2)+decInstr.immediate);
            recognizedLine=true;

            printDebugInfo("[ADDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //ANDI
        //if (firstTokenp.includes("andi")) {
        if (firstTokenp=="andi") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)&decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[ANDI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //ORI
        //if (firstTokenp.includes("ori")&&(!firstTokenp.includes("xori"))) {
        if (firstTokenp=="ori") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)|decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[ORI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //XORI
        //if (firstTokenp.includes("xori")) {
        if (firstTokenp=="xori") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)^decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[XORI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        // SLLI
        if (firstTokenp=="slli") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)<<decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[SLLI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        // SRLI
        if (firstTokenp=="srli") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>>decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[SRLI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        // SRAI
        if (firstTokenp=="srai") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>decInstr.immediate));
            recognizedLine=true;

            printDebugInfo("[SRAI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        // SLTI
        if (firstTokenp=="slti") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            //execute line
            //machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>decInstr.immediate));
            if (machinep.readRegister(decInstr.operand2)<decInstr.immediate) {
                machinep.writeRegister(decInstr.operand1, 1);
            }
            else {
                machinep.writeRegister(decInstr.operand1, 0);
            }
            recognizedLine=true;

            printDebugInfo("[SLTI x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        // SLTIU
        if (firstTokenp=="sltiu") {
            //decode line
            let decInstr=decodeRRILine(lineWithoutSpacesAndTabs.slice(5), machinep); // remove the mnemonic

            //execute line
            //machinep.writeRegister(decInstr.operand1, (machinep.readRegister(decInstr.operand2)>>decInstr.immediate));
            if ((machinep.readRegister(decInstr.operand2)>>>0)<(decInstr.immediate>>>0)) {
                machinep.writeRegister(decInstr.operand1, 1);
            }
            else {
                machinep.writeRegister(decInstr.operand1, 0);
            }
            recognizedLine=true;

            printDebugInfo("[SLTIU x"+decInstr.operand1+" x"+decInstr.operand2+" "+decInstr.immediate+"]\n");
        }

        //SW
        if (firstTokenp=="sw") {
            //check whether it's instruction "sw reg, imm(reg)" or pseudoinstruction "sw reg, label, reg
            if (lineWithoutSpacesAndTabs.includes("(")) {
                // it's instruction, decode line
                let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic
    
                //execute line
                machinep.writeWordToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );
                recognizedLine=true;
    
                printDebugInfo("[SW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelRLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic
                
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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    machinep.writeRegister(decInstr.operand2, lln);
                    machinep.writeWordToMemory( lln, machinep.readRegister(decInstr.operand1) );
                } 
                else {
                    machinep.writeRegister(decInstr.operand2, labelFoundInDataAddr);
                    machinep.writeWordToMemory(labelFoundInDataAddr, machinep.readRegister(decInstr.operand1));
                }

                recognizedLine=true;    
                printDebugInfo("[SW x"+decInstr.operand1+" LABEL " +decInstr.label+" , x" + decInstr.operand2+" ]\n");            
            }
        }
    
        //SB
        if (firstTokenp=="sb") {
            //check whether it's instruction "sb reg, imm(reg)" or pseudoinstruction "sb reg, label, reg
            if (lineWithoutSpacesAndTabs.includes("(")) {
                // it's instruction, decode line
                // decode line
                let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

                //execute line
                machinep.writeByteToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );
                recognizedLine=true;

                printDebugInfo("[SB x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelRLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic
                
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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    machinep.writeRegister(decInstr.operand2, lln);
                    machinep.writeByteToMemory( lln, machinep.readRegister(decInstr.operand1) );
                } 
                else {
                    machinep.writeRegister(decInstr.operand2, labelFoundInDataAddr);
                    machinep.writeWordToMemory(labelFoundInDataAddr, machinep.readRegister(decInstr.operand1));
                }

                recognizedLine=true;    
                printDebugInfo("[SB x"+decInstr.operand1+" LABEL " +decInstr.label+" , x" + decInstr.operand2+" ]\n");            
            }
        }

        //SH
        if (firstTokenp=="sh") {
            //check whether it's instruction "sh reg, imm(reg)" or pseudoinstruction "sh reg, label, reg
            if (lineWithoutSpacesAndTabs.includes("(")) {
                // it's instruction, decode line
                // decode line
                let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

                //execute line
                machinep.writeHalfToMemory( machinep.readRegister(decInstr.operand2)+decInstr.immediate, machinep.readRegister(decInstr.operand1) );
                recognizedLine=true;

                printDebugInfo("[SH x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelRLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic
                
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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    machinep.writeRegister(decInstr.operand2, lln);
                    machinep.writeHalfToMemory( lln, machinep.readRegister(decInstr.operand1) );
                } 
                else {
                    machinep.writeRegister(decInstr.operand2, labelFoundInDataAddr);
                    machinep.writeHalfToMemory( labelFoundInDataAddr, machinep.readRegister(decInstr.operand1) );
                }

                recognizedLine=true;    
                printDebugInfo("[SH x"+decInstr.operand1+" LABEL " +decInstr.label+" , x" + decInstr.operand2+" ]\n");            
            }
        }

        //LW
        //if (firstTokenp.includes("lw")) {
        if (firstTokenp=="lw") {
            //check whether it's instruction "lw reg, imm(reg)" or pseudoinstruction "lw reg, label"
            if (lineWithoutSpacesAndTabs.includes("(")) {
            // it's instruction, decode line
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            //execute line
            machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
            recognizedLine=true;

            printDebugInfo("[LW x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(lln));                
                } 
                else {
                    machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(labelFoundInDataAddr));
                }

                recognizedLine=true;
                printDebugInfo("[LW x"+decInstr.operand1+" LABEL " +decInstr.label+" ]\n");            
            }
        }

        //LB
        if (firstTokenp=="lb") {
            //check whether it's instruction "lb reg, imm(reg)" or pseudoinstruction "lb reg, label"
            if (lineWithoutSpacesAndTabs.includes("(")) {
                // it's instruction. decode line
                let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

                //execute line
                let b=machinep.readByteFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate);
                if (b&128) {
                    b|=0xffffff00; // sign extend
                    machinep.writeRegister(decInstr.operand1,  b);
                }
                else {
                    machinep.writeRegister(decInstr.operand1,  b);
                }
                //machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
                recognizedLine=true;

                printDebugInfo("[LB x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    //machinep.writeRegister(decInstr.operand1, machinep.readByteFromMemory(lln));
                    let b=machinep.readByteFromMemory(lln);
                    if (b&128) {
                        b|=0xffffff00; // sign extend
                        machinep.writeRegister(decInstr.operand1,  b);
                    }
                    else {
                        machinep.writeRegister(decInstr.operand1,  b);
                    }    
                } 
                else {
                    //machinep.writeRegister(decInstr.operand1, machinep.readByteFromMemory(labelFoundInDataAddr));
                    let b=machinep.readByteFromMemory(labelFoundInDataAddr);
                    if (b&128) {
                        b|=0xffffff00; // sign extend
                        machinep.writeRegister(decInstr.operand1,  b);
                    }
                    else {
                        machinep.writeRegister(decInstr.operand1,  b);
                    }    
                }

                recognizedLine=true;
                printDebugInfo("[LB x"+decInstr.operand1+" LABEL " +decInstr.label+" ]\n");            
            }
        }

        //LBU
        if (firstTokenp=="lbu") {
            // decode line
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            let b=machinep.readByteFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate);
            machinep.writeRegister(decInstr.operand1,  (b>>>0));
            //machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
            recognizedLine=true;

            printDebugInfo("[LBU x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
        }

        //LH
        if (firstTokenp=="lh") {
            //check whether it's instruction "lh reg, imm(reg)" or pseudoinstruction "lh reg, label"
            if (lineWithoutSpacesAndTabs.includes("(")) {
                // It's instruction. Decode line.
                let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

                //execute line
                let h=machinep.readHalfFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate);
                if (h&0x8000) {
                    h|=0xffff0000; //sign extend
                    machinep.writeRegister(decInstr.operand1,  h);
                }
                else {
                    machinep.writeRegister(decInstr.operand1,  h);
                }
                //machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
                recognizedLine=true;

                printDebugInfo("[LH x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
            }
            else {
                //it's pseudoinstruction
                let decInstr=decodeRLabelLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

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
                if (!labelFoundInData) {
                    let lln=findLabelInSource(machinep, decInstr.label);
                    if (lln==-1) {
                        throw new Error ("label not found in source");                        
                    }
                    //machinep.writeRegister(decInstr.operand1, machinep.readHalfFromMemory(lln));                
                    let h=machinep.readHalfFromMemory(lln);
                    if (h&0x8000) {
                        h|=0xffff0000; //sign extend
                        machinep.writeRegister(decInstr.operand1,  h);
                    }
                    else {
                        machinep.writeRegister(decInstr.operand1,  h);
                    }    
                } 
                else {
                    //machinep.writeRegister(decInstr.operand1, machinep.readHalfFromMemory(labelFoundInDataAddr));
                    let h=machinep.readHalfFromMemory(labelFoundInDataAddr);
                    if (h&0x8000) {
                        h|=0xffff0000; //sign extend
                        machinep.writeRegister(decInstr.operand1,  h);
                    }
                    else {
                        machinep.writeRegister(decInstr.operand1,  h);
                    }    
                }
                
                recognizedLine=true;
                printDebugInfo("[LH x"+decInstr.operand1+" LABEL " +decInstr.label+" ]\n");            
            }
        }

        //LHU
        if (firstTokenp=="lhu") {
            // decode line
            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            //execute line
            let h=machinep.readHalfFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate);
            machinep.writeRegister(decInstr.operand1,  (h>>>0));
            
            //machinep.writeRegister(decInstr.operand1, machinep.readWordFromMemory(machinep.readRegister(decInstr.operand2)+decInstr.immediate) );
            recognizedLine=true;

            printDebugInfo("[LHU x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( x"+ decInstr.operand2+" )]\n");            
        }

        // BEQ
        if (firstTokenp=="beq") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)==machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }


            printDebugInfo("[BEQ x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        // BNE
        if (firstTokenp=="bne") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)!=machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }

            printDebugInfo("[BNE x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //BLT
        //if (firstTokenp.includes("blt")) {
        if (firstTokenp=="blt") {
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
            else {
                recognizedLine=true;
            }
        
            printDebugInfo("[BLT x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //BGE
        if (firstTokenp=="bge") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)>=machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }

            printDebugInfo("[BGE x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //BLTU
        if (firstTokenp=="bltu") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic
    
            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }
    
                //execute line
            if ((machinep.readRegister(decInstr.operand1)>>>0)<(machinep.readRegister(decInstr.operand2)>>>0)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }
        
            printDebugInfo("[BLTU x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //BGEU
        if (firstTokenp=="bgeu") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if ((machinep.readRegister(decInstr.operand1)>>>0)>=(machinep.readRegister(decInstr.operand2)>>>0)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }

            printDebugInfo("[BGEU x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        
        //JAL
        //if (firstTokenp.includes("jal")&&(!firstTokenp.includes("jalr"))) {
        if (firstTokenp=="jal") {
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
        //if (firstTokenp.includes("jalr")) {
        if (firstTokenp=="jalr") {

            let decInstr=decodeRMEMLine(lineWithoutSpacesAndTabs.slice(4), machinep); // remove the mnemonic

            // it's a jalr instruction, execute it
            machinep.writeRegister(decInstr.operand1, machinep.currentProgramLine);
            machinep.currentProgramLine=machinep.readRegister(decInstr.operand2)+decInstr.immediate;
            recognizedLine=true;

            printDebugInfo("[JALR x"+decInstr.operand1+" IMM " +decInstr.immediate+ "( "+ decInstr.operand2+" )]\n");            
        }

        //ECALL
        //if (firstTokenp.includes("ecall")) {
        if (firstTokenp=="ecall") {            
            // call OS
            // registers aX contain the function codes
            recognizedLine=true;
            printDebugInfo("[ECALL]\n");            

            executeSyscalls(machinep);
        }

        //LUI
        if (firstTokenp=="lui") {
            let decInstr=decodeRIMMLine(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // execute it
            machinep.writeRegister(decInstr.operand1, (decInstr.immediate<<12));
            recognizedLine=true;

            printDebugInfo("[LUI x"+decInstr.operand1+" IMM " +decInstr.immediate+" ]\n");            
        }

        //AUIPC
        if (firstTokenp=="auipc") {
            let decInstr=decodeRIMMLine(lineWithoutSpacesAndTabs.slice(5), machinep); // remove the mnemonic

            // execute it
            machinep.writeRegister(decInstr.operand1, (decInstr.immediate<<12)+machinep.currentProgramLine);
            recognizedLine=true;

            printDebugInfo("[AUIPC x"+decInstr.operand1+" IMM " +decInstr.immediate+" ]\n");            
        }

        // PSEUDOINSTRUCTIONS

        //LI
        //if (firstTokenp.includes("li")) {
        if (firstTokenp=="li") {
            let decInstr=decodeRIMMLine(lineWithoutSpacesAndTabs.slice(2), machinep); // remove the mnemonic

            // execute it
            machinep.writeRegister(decInstr.operand1, decInstr.immediate);
            recognizedLine=true;

            printDebugInfo("[LI x"+decInstr.operand1+" IMM " +decInstr.immediate+" ]\n");            
        }

        //LA
        //if (firstTokenp.includes("la")) {
        if (firstTokenp=="la") {
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

        //BGT
        if (firstTokenp=="bgt") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)>machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }

            printDebugInfo("[BGT x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //BLE
        if (firstTokenp=="ble") {
            // decode line
            let decInstr=decodeRRLabel(lineWithoutSpacesAndTabs.slice(3), machinep); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, decInstr.label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            //execute line
            if (machinep.readRegister(decInstr.operand1)<=machinep.readRegister(decInstr.operand2)) {
                machinep.currentProgramLine=lln;
                recognizedLine=true;
            }
            else {
                recognizedLine=true;
            }

            printDebugInfo("[BLE x"+decInstr.operand1+" x " +decInstr.operand2+ " "+decInstr.label+" ]\n");            
        }

        //CALL
        if (firstTokenp=="call") {

            let label=lineWithoutSpacesAndTabs.slice(4); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            // it's a call instruction, execute it
            machinep.writeRegister(1, machinep.currentProgramLine); // return address to ra
            machinep.currentProgramLine=lln;
            recognizedLine=true;
    
            printDebugInfo("[CALL "+label+"]\n");            
        }

        //J
        if (firstTokenp=="j") {

            let label=lineWithoutSpacesAndTabs.slice(1); // remove the mnemonic

            // label must be found in source code
            let lln=findLabelInSource(machinep, label);
            if (lln==-1) {
                throw new Error ("label not found in source");
            }

            // it's a j instruction, execute it
            machinep.currentProgramLine=lln;
            recognizedLine=true;
    
            printDebugInfo("[J "+label+"]\n");            
        }

        //RET
        if (firstTokenp=="ret") {

            // it's a ret instruction, execute it
            machinep.currentProgramLine=machinep.readRegister(1); // ra contains the return addres
            recognizedLine=true;
    
            printDebugInfo("[RET]\n");            
        }


            
    } // else

    if (!recognizedLine) {
        //printDebugInfo(lineWithoutSpacesAndTabs);
        throw new Error ("Instruction not recognized");
    }


}  


// decode an Reg-Reg-Reg instruction into operands
function decodeRRRLine(textLine, myMachinep) {
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
    let op3=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[2].includes(myMachinep.registersNames[i])) {
            op3=i;
        }
    }
    if ((op1==-1)||(op2==-1)||(op3==-1)) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        operand2: op2,
        operand3: op3
    }
    
    return decodedInstr;
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

// decode instruction: instr Reg, imm(Reg)
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

// decode pseudo-instruction: instr R, label, R
function decodeRLabelRLine(textLine, myMachinep) {
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

    if (op1==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let labl=splitInstr[1];

    let op2=-1;
    for (let i=0; i<32; i++) {
        if (splitInstr[2].includes(myMachinep.registersNames[i])) {
            op2=i;
        }
    }

    if (op2==-1) {
        throw new Error ("ilegal instruction operands");
    }

    let decodedInstr = {
        operand1: op1,
        label: labl,
        operand2: op2
    }
    
    return decodedInstr;    
}


function processDataSection (myMachine) {
    let currentDataLine; // current data line
    let myDataLabels=[];
    try {
        let dataStarted=false;
        let currentDataAddr=myMachine.programCode.length*4; // we reserve space for future needs, like program instructions
        myMachine.addrDataStartsAt=currentDataAddr;
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

function updateMemoryInHTML(machine) {

    if (machine==null) return;

    let myMemDiv = document.getElementById('MemDiv');
    let s="<table id=\"RegsTableMem\"><tr><th>Addr</th><th>Value</th></tr>";
    for (let i=0; i<16; i++) {
        s+= "<tr> <td>"  +(((i*4)+machine.addrDataStartsAt)>>>0).toString(16)+ "</td> <td>"+ ((machine.readWordFromMemory((i*4)+machine.addrDataStartsAt))>>>0).toString(16) +"</td> </tr>";
    }
    s+=`<tr>
            <td><p></p></td>
            <td><p></p></td>
        </tr>
        <tr>
            <td><input type="text" id="AddrLabel" value="0x00000000"></td>
            <td> <input type="button" id="AddrButton "onclick="alert('Hello World!')" value="Go"> </td>
        </tr>
    </table>`;
    myMemDiv.innerHTML=s;
    //myRegistersDiv.innerHTML="<table><tr><th>Register</th><th>Value</th></tr><tr><td>x0 zero</td><td>value</td></tr><tr><td>x1 ra</td><td>0 orsth</td></tr>";
}

function setupVirtualMachine (testProgramp) {
    // set up the virtual machine
    let M=new Uint8Array(64*1024);
    let R= new Int32Array(32);
    let RN= ["zero", "ra", "sp", "gp", "tp", "t0", "t1","t2", "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"];
    let myMachine = {
        registers: R,
        registersNames: RN,
        programCode: testProgramp,
        currentProgramLine: 0,
        memory: M,
        dataLabelsInfo:null,
        addrDataStartsAt: 0,

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
        },
        writeHalfToMemory: function(memaddr, value) {
            this.memory[memaddr]=(value&0xff);
            this.memory[memaddr+1]=((value&0xff00)>>8);
        },
        readHalfFromMemory: function(memaddr) {
            let w=0;
            w=w|this.memory[memaddr];
            w=w|(this.memory[memaddr+1]<<8);
            return w;
        }

    };
    for (let i=0; i<32; i++) {
        myMachine.writeRegister(i, 0); //all regs to 0
    }

    document.getElementById('MyTextArea').value=""; //clean textarea

    // Data processing here: first we go to the data section and process the data
    let pdsResult=processDataSection(myMachine);
    if (!pdsResult) return null; // if there are data errors, no more actions are performed

    //advance the currentProgramLine to the .text section, if it exists
    for (let i=0; i<myMachine.programCode.length; i++) {
        let myLine=myMachine.programCode[i];
        if (myLine.includes(".text")) {
            myMachine.currentProgramLine=i+1;
            break;
        }
    }

    return myMachine;
}

function executeProgramInVirtualMachine(myMachine) {

    if (myMachine==null) return;

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

    updateRegistersInHTML(myMachine);
    updateMemoryInHTML(myMachine);
}

function RunButtonOnClick () {
    window.virtualMachine=setupVirtualMachine(window.programToBeExecuted);
    if (window.virtualMachine==null)
        return;
    
    // try to run the program
    executeProgramInVirtualMachine(window.virtualMachine);

}