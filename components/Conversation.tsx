"use client";
import BotAvatar from "#/components/BotAvatar";
import EmptyState from "#/components/EmptyState";
import Loader from "#/components/Loader";
import UserAvatar from "#/components/UserAvatar";
import { Button } from "#/components/ui/button";
import { api } from "#/convex/_generated/api";
import { cn } from "#/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { MessagesSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Heading from "./ui/heading";

const formSchema = z.object({
  promptMessage: z.string(),
});

export interface Message {
  content: string;
  sender: string;
}

const Conversation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const handleGenerateConversation = useAction(
    api.openai.generateConversationAction
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptMessage: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: data.promptMessage,
        sender: "user",
      },
    ]);
    form.reset();
    setIsLoading(true);
    const historyData = [
      messages
        ?.filter((msg) => msg.sender === "user")
        ?.flatMap((msg) => msg.content),
      data.promptMessage,
    ]
      ?.toString()
      ?.replace(",", "->");

    const response = await handleGenerateConversation({
      promptMessage: data.promptMessage,
      userName: user?.fullName!,
      history: historyData,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: response,
        sender: "bot",
      },
    ]);
    setIsLoading(false);
  }

  return (
    <section>
      <div className="flex gap-5">
        <Heading
          title="Conversation"
          desc="Our most advanced conversation model"
          icon={MessagesSquare}
          iconColor="text-white-1"
          bgColor="bg-orange-1"
        />
      </div>
      <div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-12 flex w-full flex-col"
            >
              <div className="border rounded flex flex-col items-center sm:flex-row gap-2 bg-white-1 border-1 border-[#ffffff] p-8">
                <FormField
                  control={form.control}
                  name="promptMessage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5 w-full">
                      <FormControl>
                        <Input
                          className="border-none"
                          placeholder="Ask me anything!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={messages?.length >= 20}
                  type="submit"
                  className="text-16 w-full sm:w-[100px] bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                >
                  generate
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="pt-[1rem]">
        {isLoading && <Loader content="Tommy is thinking..."/>}
        {messages?.length === 20 && !isLoading && (
          <EmptyState title="Please reload the page to keep continue (maximum 10 questions exceeded)." />
        )}
        {messages.length === 0 && !isLoading && (
          <EmptyState title="No conversation started." />
        )}
        {messages?.length < 20 && (
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                className={cn(
                  "p-8 w-full text-black-1 flex items-start gap-x-8 rounded",
                  message.sender === "user" ? "bg-white-1" : "bg-orange-100"
                )}
                key={message.content}
              >
                {message.sender === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Conversation;
