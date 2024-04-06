.data 
userp:
    .asciiz "Please, enter your name"
hellostr:
    .asciiz "Hello, "
carrret:
    .asciiz "!\n"
heapStartsHere:

.text

#ask the user for his name, heapStartsHere points to the start of the heap

    li a0, 3                	#prompt the user for text
    la a1, userp            	#string to print
    la a2, heapStartsHere   	#at this address, the string will be written
				#returns the string at the address in a2                            
    ecall

#print hello string

    li a0, 0            #print string syscall
    la a1, hellostr	#asciiz string addr
    ecall

#now, we print the string given

    li a0, 0
    la a1, heapStartsHere
    ecall

# print carriage return 

    li a0, 0            #print string syscall
    la a1, carrret	#asciiz string addr
    ecall
